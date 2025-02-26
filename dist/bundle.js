(()=>{let e=new THREE.Scene,t=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,1e3),o=new THREE.WebGLRenderer;o.setSize(window.innerWidth,window.innerHeight),document.body.appendChild(o.domElement);let n=[];const i=new THREE.GLTFLoader,s=new Map,a={};function d(t,o,d,l,r){i.load(o,(o=>{const i=o.scene;i.name=t,i.scale.set(...l),i.rotation.set(...r),i.position.set(...d),e.add(i),n.push(i),a[t]=i,s.set(i,{position:i.position.clone(),scale:i.scale.clone()})}),void 0,(e=>{console.error(e)}))}function l(){const e=[[0,2,0],[0,-2,0],[5,2,0],[-5,2,0],[-5,-2,0]];if(window.innerWidth<=768){const e=4;for(let t=0;t<n.length;t++)n[t].position.set(0,t*-e,0)}else for(let t=0;t<n.length;t++)n[t].position.set(e[t][0],e[t][1],e[t][2])}d("AboutMeModel","Models/AboutMe.glb",[0,2,0],[1,.5,1],[Math.PI/2,0,0]),d("TestimonialsModel","Models/Testimonials.glb",[0,-2,0],[1,.5,1],[Math.PI/2,0,0]),d("RepoModel","Models/repos.glb",[5,2,0],[1,.5,1],[Math.PI/2,0,0]),d("ProjectsModel","Models/Projects.glb",[-5,2,0],[1,.5,1],[Math.PI/2,0,0]),d("SocialsModel","Models/Socials.glb",[-5,-2,0],[1,.5,1],[Math.PI/2,0,0]);const r=new THREE.PointLight(16777215,8,200);r.position.set(10,12,10),e.add(r);const c=new THREE.PointLight(16777215,8,200);c.position.set(-10,12,10),e.add(c);const h=new THREE.PointLightHelper(r,1);e.add(h);let p=[],w=window.innerWidth,m=window.innerHeight;t.position.z=5,t.position.y=0;let M=new THREE.Clock,u=!1;function E(){const e=window.innerWidth,n=window.innerHeight;e===w&&n===m||(o.setSize(e,n),t.aspect=e/n,t.updateProjectionMatrix(),w=e,m=n)}document.addEventListener("wheel",(function(e){e.preventDefault(),e.deltaY>0?(console.log("Mouse wheel scrolled down"),t.position.y-.55>=-15?t.position.y-=.55:t.position.y=-15):e.deltaY<0&&(console.log("Mouse wheel scrolled up"),t.position.y+.5<=5?t.position.y+=.5:t.position.y=5)})),function i(){requestAnimationFrame(i),l(),Math.random()<.5&&p.length<1500&&function(){let t=new THREE.BoxGeometry,o=new THREE.MeshBasicMaterial({color:16777215,wireframe:!0,transparent:!0}),n=new THREE.Mesh(t,o),i=window.innerWidth/2,s=window.innerHeight/2,a=36*Math.random()-35;n.position.set(Math.random()*i-i/2,Math.random()*s-s/2,a),n.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI),e.add(n),p.push(n)}(),M.getDelta();for(let e=0;e<=n.length-1;e++)u||(n[e].rotation.z=.05*Math.sin(M.getElapsedTime()),n[e].rotation.y=.05*Math.cos(M.getElapsedTime()));p.forEach((e=>{e.position.y-=.03,e.rotation.x+=.001,e.rotation.y+=.001,e.position.y<-20&&(e.position.y=20,e.position.x=40*Math.random()-20,e.position.z=25*Math.random()-30,e.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI)),function(e){let t=(e.position.z- -10)/20;t=THREE.MathUtils.clamp(t,0,1),e.material.transparent=!0,e.material.opacity=t,e.material.needsUpdate=!0}(e)})),o.render(e,t)}(),window.addEventListener("resize",E);const f=new THREE.Raycaster,g=new THREE.Vector2;let v=null;function y(o){if(u)return;g.x=o.clientX/window.innerWidth*2-1,g.y=-o.clientY/window.innerHeight*2+1,f.setFromCamera(g,t);const n=Object.values(a),i=f.intersectObjects(n,!0);if(i.length>0){let t=i[0].object;for(;t.parent&&t.parent!==e;)t=t.parent;if(v!==t){if(v){let e=s.get(v);e&&(v.position.copy(e.position),v.scale.set(1,.5,1))}s.has(t)||s.set(t,{position:t.position.clone(),scale:t.scale.clone()}),v=t,u=!0;let e=t.rotation.z,o=e+2*Math.PI,n=500,i=performance.now();!function s(d){let l=d-i,r=Math.min(l/n,1);if(t.rotation.z=e+r*(o-e),r<1)requestAnimationFrame(s);else switch(u=!1,t){case a.RepoModel:return void window.open("https://github.com/jessesound","_blank");case a.AboutMeModel:return void(window.location.href="AboutMe.html");case a.TestimonialsModel:return void(window.location.href="Testimonials.html");case a.SocialsModel:return void(window.location.href="Socials.html");case a.ProjectsModel:return void(window.location.href="Projects.html")}}(performance.now())}}}let T=!1,H=0;function P(e){e.preventDefault();let o=0;"wheel"===e.type?o=e.deltaY:"touchmove"===e.type&&e.touches.length<2&&(o=e.touches[0].clientY-H,H=e.touches[0].clientY),T||(T=!0,function(e){let o=e<0?1:-1;t.position.y+=o,console.log(t.position.y),t.position.y=Math.max(Math.min(t.position.y,15),-18)}(o),setTimeout((()=>{T=!1}),40))}document.addEventListener("wheel",P),document.addEventListener("touchmove",P),document.addEventListener("wheel",P,{passive:!1}),document.addEventListener("touchmove",P,{passive:!1}),document.addEventListener("touchstart",(e=>{H=e.touches[0].clientY}),{passive:!1}),document.addEventListener("click",y),document.addEventListener("touchend",y),E(),window.addEventListener("resize",l),l()})();