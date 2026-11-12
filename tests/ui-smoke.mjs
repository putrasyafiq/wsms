import assert from 'node:assert/strict';
const nodes=new Map();class El{constructor(id=''){this.id=id;this.children=[];this.dataset={};this.classList={toggle(){},add(){},remove(){}};this.style={};this.clientWidth=1000;this.clientHeight=700;this.value='';this.checked=true;this.listeners={};}setAttribute(k,v){this[k]=v}append(n){this.children.push(n)}replaceChildren(){this.children=[]}addEventListener(k,f){this.listeners[k]=f}getBoundingClientRect(){return {left:0,top:0,width:1000,height:700}}closest(){return null}hasAttribute(k){return k in this}setPointerCapture(){} }
const get=id=>{if(!nodes.has(id))nodes.set(id,new El(id));return nodes.get(id)};const tabs=['foundation','section','racks'].map(t=>{let e=new El();e.dataset.tab=t;return e});
const addButtons=['rect','triangle'].map(type=>{const e=new El();e.dataset.add=type;return e});
const pageTabs=['overview','editor'].map(page=>{const e=new El();e.dataset.page=page;return e});const overviewTabs=['dashboard','tables','excel'].map(view=>{const e=new El();e.dataset.overview=view;return e});
globalThis.document={querySelector(s){if(s==='#rackPattern')return null;return get(s)},querySelectorAll(s){return s==='[data-tab]'?tabs:s==='[data-add]'?addButtons:s==='[data-page]'?pageTabs:s==='[data-overview]'?overviewTabs:[]},createElementNS(){return new El()},addEventListener(){}};globalThis.window={addEventListener(){}};globalThis.localStorage={getItem(){return null},setItem(){}};globalThis.ResizeObserver=class{observe(){}};globalThis.requestAnimationFrame=f=>f();
await import('../dist/app.js');assert(get('#shapeList').innerHTML.includes('Foundation 1'));tabs[2].onclick();assert.equal(get('#geometryPanel').hidden,true);assert.equal(get('#racksPanel').hidden,false);assert(get('#racksPanel').innerHTML.includes('Rack editor'));tabs[1].onclick();assert.equal(get('#wallsPanel').hidden,true);tabs[0].onclick();assert.equal(get('#wallsPanel').hidden,false);console.log('App boot and Foundation / Sections / Racks / Info switching passed with DOM test doubles.');

tabs[1].onclick();addButtons[0].onclick();tabs[2].onclick();
globalThis.FormData=class{constructor(form){this.data=form.data}get(k){return this.data[k]}};
const submit=get('#racksPanel').listeners.submit;
submit({preventDefault(){},target:{id:'rackTypeForm',data:{name:'Standard',length:'2',width:'1',height:'5',pallets:'12'}}});
assert(get('#racksPanel').innerHTML.includes('Standard'));
submit({preventDefault(){},target:{id:'addRacksForm',data:{typeId:get('#racksPanel').innerHTML.match(/option value="([^"]+)"[^>]*>Standard/)[1],quantity:'3',assigned:'true'}}});
assert(get('#racksPanel').innerHTML.includes('3 / 0'));

console.log('Rack type creation, batch addition, and assigned counts passed.');
tabs[0].onclick();
const key=get('#wallList').innerHTML.match(/data-wall-toggle="([^"]+)"/)[1];
get('#wallList').onchange({target:{dataset:{wallToggle:key}}});
get('#entrancesPanel').listeners.submit({preventDefault(){},target:{id:'entranceForm',data:{width:'3',type:'swing'}}});
assert(get('#entrancesPanel').innerHTML.includes('Swinging door 1'));
get('#entrancesPanel').listeners.click({target:{closest(){return {hasAttribute:k=>k==='data-place-entrance'}}}});
get('#canvas').onpointerdown({button:0,clientX:500,clientY:90,target:{closest(){return null}}});
assert(get('#entrancesPanel').innerHTML.includes('3 m · placed'));
assert(get('#racksPanel').innerHTML.includes('step="any"'));
console.log('Entrance creation and canvas wall placement passed; dimension forms use unrestricted decimal steps.');
const firstFloor=get('#floorSwitcher').innerHTML.match(/data-floor="([^"]+)"/)[1];
get('#floorsPanel').listeners.click({target:{closest:s=>s==='#addFloor'?{}:null}});
assert(get('#floorSwitcher').innerHTML.includes('>2</button>'));
assert(get('#entrancesPanel').innerHTML.includes('0 entrances'));
tabs[1].onclick();assert(get('#shapeList').innerHTML.includes('No sections'));
tabs[0].onclick();const secondFloor=[...get('#floorSwitcher').innerHTML.matchAll(/data-floor="([^"]+)"/g)][1][1];
get('#floorsPanel').listeners.change({target:{dataset:{floorLabel:secondFloor},value:'Mezzanine'}});
assert.equal(get('#activeFloorLabel').textContent,'Mezzanine');
get('#floorSwitcher').listeners.click({target:{closest:s=>s==='[data-floor]'?{dataset:{floor:firstFloor}}:null}});
assert(get('#entrancesPanel').innerHTML.includes('Swinging door 1'));
tabs[2].onclick();assert(get('#racksPanel').innerHTML.includes('3 / 0'));
console.log('Floor creation, numbered switcher, rename, empty new sections, and source-floor rack/entrance restoration passed.');

pageTabs[0].onclick();assert.equal(get('#editorPage').hidden,true);assert.equal(get('#overviewPage').hidden,false);assert(get('#overviewContent').innerHTML.includes('capacityLayout'));assert(get('#overviewContent').innerHTML.includes('Whitespace'));overviewTabs[1].onclick();assert(get('#overviewContent').innerHTML.includes('Racks by type and assignment'));overviewTabs[2].onclick();assert(get('#overviewContent').innerHTML.includes('excelGrid'));pageTabs[1].onclick();assert.equal(get('#editorPage').hidden,false);assert.equal(get('#overviewPage').hidden,true);console.log('Overview/Editor navigation, full-width dashboard layout chart, grouped tables and Excel grid passed.');
const highlighted=()=>({dataset:{},classList:{value:false,toggle(k,v){this.value=v}}});const mapSection=highlighted(),listSection=highlighted();mapSection.dataset.capacitySection='linked';listSection.dataset.breakdownSection='linked';const oldQuery=document.querySelectorAll;document.querySelectorAll=s=>s==='[data-capacity-section]'?[mapSection]:s==='[data-breakdown-section]'?[listSection]:oldQuery(s);get('#overviewContent').listeners.pointerover({target:{closest:()=>listSection}});assert.equal(mapSection.classList.value,true);assert.equal(listSection.classList.value,true);get('#overviewContent').listeners.pointerout({relatedTarget:null});assert.equal(mapSection.classList.value,false);get('#overviewContent').listeners.focusin({target:{closest:()=>listSection}});assert.equal(mapSection.classList.value,true);console.log('Section hover, pointer leave and keyboard focus highlight matching capacity-map geometry.');
window.wsmsSession={user:{id:'u',email:'viewer@test.com'},warehouse:null};window.wsmsOpenWarehouse({warehouse:{id:'read-only',name:'Viewer warehouse',role:'viewer'},document:null},'editor');assert.equal(get('#editorPage').hidden,true);assert.equal(get('#overviewPage').hidden,false);assert.equal(get('#import').disabled,true);assert(get('#overviewContent').innerHTML.includes('No foundation'));window.wsmsShowPage('editor');assert.equal(get('#editorPage').hidden,true);window.wsmsOpenWarehouse({warehouse:{id:'editable',name:'Editable warehouse',role:'editor'},document:null},'editor');assert.equal(get('#editorPage').hidden,false);assert.equal(get('#import').disabled,false);assert(get('#shapeList').innerHTML.includes('No foundation'));console.log('Warehouse launch permissions passed: viewers see Overview, cannot enter Editor/import, editors launch empty isolated layouts.');
