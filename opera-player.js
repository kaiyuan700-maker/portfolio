(()=>{
const player=document.createElement('aside');
player.className='opera-player';player.setAttribute('aria-label','戏曲播放器');
player.innerHTML='<button class="opera-record" type="button" aria-label="播放京剧《洛神》，演唱 未匀斋；可沿右边缘上下拖动" aria-pressed="false"><span class="opera-vinyl" aria-hidden="true"></span><span class="opera-label" aria-hidden="true"><span class="opera-initial">听一段戏</span><span class="opera-details">京剧《洛神》</span><span class="opera-details opera-performer">演唱 未匀斋</span></span></button><audio preload="none" src="./audio/luoshen-weiyun.mp3"></audio><span class="sr-only opera-status" role="status"></span>';
document.body.append(player);
const button=player.querySelector('button'),audio=player.querySelector('audio'),status=player.querySelector('.opera-status');
let drag=null,suppressClick=false,pending=false;
function place(y){player.style.top=Math.max(0,Math.min(y,Math.max(0,window.innerHeight-player.offsetHeight)))+'px';}
function sync(){const playing=!audio.paused&&!audio.ended;player.classList.toggle('is-playing',playing);button.setAttribute('aria-pressed',String(playing));button.setAttribute('aria-label',(playing?'暂停':'播放')+'京剧《洛神》，演唱 未匀斋；可沿右边缘上下拖动');}
audio.addEventListener('play',()=>{player.classList.add('has-started');sync();});
['pause','ended'].forEach(event=>audio.addEventListener(event,sync));
audio.addEventListener('error',()=>{sync();status.textContent='音频暂时无法播放，请稍后重试。';});
button.addEventListener('click',async event=>{
if(suppressClick&&event.detail!==0){suppressClick=false;return;}
if(pending)return;
if(!audio.paused){audio.pause();return;}
pending=true;status.textContent='';
try{await audio.play();}catch{status.textContent='音频暂时无法播放，请再次点击重试。';sync();}finally{pending=false;}
});
button.addEventListener('pointerdown',event=>{if(!event.isPrimary||event.button!==0)return;suppressClick=false;drag={id:event.pointerId,y:event.clientY,x:event.clientX,top:player.getBoundingClientRect().top,moved:false};button.setPointerCapture(event.pointerId);});
button.addEventListener('pointermove',event=>{if(!drag||drag.id!==event.pointerId)return;if(Math.hypot(event.clientY-drag.y,event.clientX-drag.x)>6)drag.moved=true;if(drag.moved){suppressClick=true;place(drag.top+event.clientY-drag.y);}});
function finish(event){if(!drag||drag.id!==event.pointerId)return;suppressClick=drag.moved;drag=null;if(button.hasPointerCapture(event.pointerId))button.releasePointerCapture(event.pointerId);}
['pointerup','pointercancel','lostpointercapture'].forEach(event=>button.addEventListener(event,finish));
button.addEventListener('keydown',event=>{if(event.key==='ArrowUp'||event.key==='ArrowDown'){event.preventDefault();place(player.getBoundingClientRect().top+(event.key==='ArrowUp'?-20:20));}});
window.addEventListener('resize',()=>place(player.getBoundingClientRect().top));place(player.getBoundingClientRect().top);
})();
