const LEVELS=[
 {id:"easy",name:"Easy",desc:"Short sentences · 60 s",time:60,pool:[
  "The cat sat on the mat.","I like to play with my dog.","We can see the sun and the sky.","She has a red hat and a blue bag.","The bird sits in the tree.","Mom made hot soup for us.","He runs to the park every day.","Our team won the game today.","The fish swims in the water.","Please open the door for me.","It is a nice day to walk.","My friend gave me a book."]},
 {id:"medium",name:"Medium",desc:"Longer sentences · 60 s",time:60,pool:[
  "Learning to type quickly takes patience, but a little practice every day makes a big difference.",
  "The market opens early in the morning, and people come from every village to buy fresh bread and fruit.",
  "When the weather is nice, we usually have lunch in the garden and talk about our plans for the weekend.",
  "My brother finished his homework before dinner, so he could watch a movie with the whole family.",
  "A good friend will listen carefully, answer honestly, and always remember the little things you say.",
  "The train arrived at the station a few minutes late, but nobody seemed to mind the short wait.",
  "Please remember to bring your keys, your wallet, and a warm jacket because it might rain tonight.",
  "She walked slowly along the river, thinking about the journey she would begin the next morning."]},
 {id:"hard",name:"Hard",desc:"Paragraphs · 90 s",time:90,pool:[
  "Typing is a skill that grows with steady practice. At first, your fingers may feel slow and clumsy, and that's completely normal. Focus on accuracy before speed, keep your eyes on the screen, and let the rhythm come naturally. Before long, you'll notice that whole words flow out without any effort.",
  "Every morning, Maria walks along the river before work. She likes the quiet, the cool air, and the way the light falls on the water. \"If I start the day calmly,\" she says, \"everything else feels easier.\" By the time she reaches the office, her mind is clear and ready.",
  "A small habit, repeated daily, can change your life more than a single big effort. Whether you're learning a language, saving money, or training for a race, progress comes in tiny steps. Be patient, stay consistent, and celebrate every improvement, no matter how small.",
  "The old library on Pine Street opens at nine, and by ten o'clock the reading room is nearly full. Students spread their notes across the tables, while retired neighbors read newspapers by the window. It's a peaceful place where everyone seems to move a little slower."]},
 {id:"expert",name:"Expert",desc:"Numbers & symbols · 90 s",time:90,pool:[
  "Order 4821 was placed on 03/15 at 9:45 a.m. The total came to 128.50 dollars (tax included), with a 15 percent discount on 3 of the 5 items. Delivery is expected in 2-4 days; please call 555-0192 or email help@shop-example.com if anything is missing.",
  "Our team solved 12 of 15 puzzles in 47 minutes (a new record!). The score is calculated as: points = 10 * solved + 5 - penalty, where the penalty is 2 for each hint. For example, 12 * 10 + 5 - 4 = 121. Tomorrow's goal: beat 130 points.",
  "To reset your password: open settings, choose \"Account\", then type your new code (at least 8 characters). Use letters, numbers, and one symbol, like user_2026-safe. Never share it with anyone; the support team will never ask for it. Questions? Write to care@example.com.",
  "The recipe needs 2 cups of flour, 1/2 cup of sugar, 3 eggs, and 250 ml of milk. Mix everything for 5-6 minutes, then bake at 180 degrees for 35 minutes. Let it cool (about 20 minutes) before serving; it makes 8 slices. Enjoy!"]}
];
const $=s=>document.querySelector(s);
const textEl=$("#text"),inp=$("#inp"),dlg=$("#dlg");
let lv=LEVELS[0],text="",spans=[],started=false,left=60,tick=null,errs=0,typedTotal=0,prevLen=0,done=false;

let actx=null,soundOn=store(true,"kst-sound")!=="off";
function beep(kind){
  if(!soundOn)return;
  try{
    actx=actx||new (window.AudioContext||window.webkitAudioContext)();
    if(actx.state==="suspended")actx.resume();
    const notes=kind==="end"?[[660,0],[880,.14],[1320,.28]]:kind==="bad"?[[150,0]]:[[kind==="space"?520:760,0]];
    notes.forEach(([f,d])=>{
      const o=actx.createOscillator(),g=actx.createGain(),t=actx.currentTime+d;
      o.type=kind==="bad"?"sawtooth":"sine";o.frequency.value=f;
      const len=kind==="end"?.3:kind==="bad"?.12:.05;
      g.gain.setValueAtTime(kind==="bad"?.08:.1,t);g.gain.exponentialRampToValueAtTime(.001,t+len);
      o.connect(g);g.connect(actx.destination);o.start(t);o.stop(t+len);
    });
  }catch(e){}
}
function store(get,key,val){try{if(get)return localStorage.getItem(key);localStorage.setItem(key,val)}catch(e){return null}}
function best(){return +(store(true,"kst-best-"+lv.id)||0)}

let bag=[],lastP="";
function nextPassage(){
  if(!bag.length){
    bag=lv.pool.slice();
    for(let i=bag.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[bag[i],bag[j]]=[bag[j],bag[i]]}
    if(bag.length>1&&bag[bag.length-1]===lastP)bag.unshift(bag.pop());
  }
  return lastP=bag.pop();
}
function gen(n){let out="";while(out.length<n)out+=nextPassage()+" ";return out}
function append(s){
  text+=s;
  for(const ch of s){const sp=document.createElement("span");sp.textContent=ch;textEl.appendChild(sp);spans.push(sp)}
}
function reset(){
  bag=[];lastP="";clearInterval(tick);started=false;done=false;errs=0;typedTotal=0;prevLen=0;left=lv.time;
  text="";spans=[];textEl.innerHTML="";textEl.style.transform="";typed="";comp="";clearBox();
  append(gen(400));paint();stats();inp.focus();
  $("#best").textContent=best()?"Your best here: "+best()+" WPM":"No score yet at this level";
}
function stats(){
  $("#time").textContent=left;$("#tbox").classList.toggle("low",started&&left<=10);
  $("#fill").style.width=(left/lv.time*100)+"%";
  const v=cur();let ok=0;for(let i=0;i<v.length;i++)if(v[i]===text[i])ok++;
  const el=lv.time-left;
  const wpm=el>0?Math.round(ok/5/(el/60)):0;
  $("#wpm").textContent=wpm;
  $("#acc").textContent=(typedTotal?Math.round((typedTotal-errs)/typedTotal*100):100)+"%";
  return{ok,wpm};
}
function paint(){
  const v=cur();
  spans.forEach((sp,i)=>{
    sp.className=i<v.length?(v[i]===text[i]?"ok":"bad"):(i===v.length?"cur":"");
  });
  const c=spans[v.length];
  if(c){const y=c.offsetTop;const h=parseFloat(getComputedStyle(textEl).lineHeight);textEl.style.transform="translateY("+(-Math.max(0,y-h))+"px)"}
}
function start(){
  started=true;
  tick=setInterval(()=>{left--;stats();if(left<=0)finish()},1000);
}
function finish(){
  clearInterval(tick);done=true;left=Math.max(left,0);beep("end");
  const{ok,wpm}=stats();
  const accV=typedTotal?Math.round((typedTotal-errs)/typedTotal*100):100;
  $("#rw").textContent=wpm;$("#ra").textContent=accV+"%";$("#rc").textContent=ok;$("#re").textContent=errs;
  const prev=best();
  if(wpm>prev){store(false,"kst-best-"+lv.id,wpm);$("#dtitle").textContent="New best!";$("#rb").textContent=prev?"Previous best: "+prev+" WPM":"First score on "+lv.name+".";}
  else{$("#dtitle").textContent="Time’s up";$("#rb").textContent="Best on "+lv.name+": "+prev+" WPM";}
  $("#best").textContent="Your best here: "+Math.max(wpm,prev)+" WPM";
  if(!dlg.open)dlg.showModal();
}
/* Input model: we keep our own "typed" string and never trust the textarea's value or caret.
   The textarea only holds one invisible sentinel character, so clicks, selections, arrow keys,
   autocorrect and text suggestions have nothing to act on. */
const SENT="\u200b";
let typed="",comp="";
const cur=()=>typed+comp;
function clearBox(){inp.value=SENT;try{inp.setSelectionRange(1,1)}catch(e){}}
function refresh(){paint();stats()}
function push(str){
  if(done)return;
  for(const ch of str){
    if(ch==="\n"||ch==="\r"||ch==="\t"||ch===SENT)continue;
    if(!started)start();
    const i=typed.length,bad=ch!==text[i];
    typed+=ch;typedTotal++;if(bad)errs++;
    beep(bad?"bad":ch===" "?"space":"ok");
    if(typed.length>text.length-80)append(gen(300));
  }
  refresh();
}
function back(word){
  if(done||!typed.length)return;
  if(word){let n=typed.length;while(n>0&&typed[n-1]===" ")n--;while(n>0&&typed[n-1]!==" ")n--;typed=typed.slice(0,n)}
  else typed=typed.slice(0,-1);
  refresh();
}
inp.addEventListener("keydown",e=>{
  if(e.key==="Escape"){e.preventDefault();reset();return}
  if(e.isComposing||e.keyCode===229||e.key==="Process"||e.key==="Unidentified")return;
  if(e.key==="Backspace"){e.preventDefault();back(e.ctrlKey||e.altKey);return}
  const alt=e.getModifierState&&e.getModifierState("AltGraph");
  if(e.key.length===1&&!e.metaKey&&(!e.ctrlKey||alt)&&(!e.altKey||alt)){e.preventDefault();push(e.key);return}
  const blocked=["Enter","Tab","Delete","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End","PageUp","PageDown"];
  if(blocked.includes(e.key)||((e.ctrlKey||e.metaKey)&&["a","z","y","x","v"].includes(e.key.toLowerCase())))e.preventDefault();
});
/* Fallback path for phone keyboards, IMEs and dead keys, which don't report normal key events */
inp.addEventListener("input",e=>{
  if(e.isComposing){comp=inp.value.split(SENT).join("");refresh();return}
  comp="";
  const v=inp.value;
  if(v.startsWith(SENT)){const add=v.slice(1);if(add)push(add);else refresh()}
  else if(!v||/^delete/.test(e.inputType||""))back(e.inputType==="deleteWordBackward");
  else push(v);
  clearBox();
});
inp.addEventListener("compositionend",()=>{
  const add=inp.value.split(SENT).join("");comp="";
  if(add)push(add);else refresh();
  clearBox();
});
inp.addEventListener("beforeinput",e=>{if(/^(insertFromPaste|insertFromDrop|insertLineBreak|insertParagraph|historyUndo|historyRedo|deleteByCut)/.test(e.inputType))e.preventDefault()});
inp.addEventListener("paste",e=>e.preventDefault());
document.addEventListener("keydown",e=>{
  if(dlg.open||e.ctrlKey||e.metaKey||e.altKey||document.activeElement===inp)return;
  const a=document.activeElement;
  if(e.key.length===1&&!(a&&a.tagName==="BUTTON"&&e.key===" "))inp.focus();
});
$("#field").addEventListener("click",()=>inp.focus());
$("#restart").addEventListener("click",reset);
$("#again").addEventListener("click",()=>dlg.close());
dlg.addEventListener("close",()=>{if(done)reset()});

function syncSnd(){const b=$("#snd");b.textContent="Sound: "+(soundOn?"on":"off");b.setAttribute("aria-pressed",String(soundOn))}
$("#snd").addEventListener("click",()=>{soundOn=!soundOn;store(false,"kst-sound",soundOn?"on":"off");syncSnd();beep("ok");inp.focus()});
syncSnd();
const box=document.querySelector(".levels");
LEVELS.forEach(l=>{
  const b=document.createElement("button");b.className="lv";b.type="button";
  b.innerHTML="<b>"+l.name+"</b><span>"+l.desc+"</span>";
  b.addEventListener("click",()=>{lv=l;sync();reset()});
  box.appendChild(b);l.btn=b;
});
function sync(){LEVELS.forEach(l=>l.btn.setAttribute("aria-pressed",String(l===lv)))}
sync();reset();
