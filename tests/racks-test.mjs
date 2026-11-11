import assert from 'node:assert/strict';
import {rackStats,racksValid,allocation} from '../dist/racks.js';
import {polygon,area,segments} from '../dist/geometry.js';
const shape={id:'s',layer:'section',type:'rect',x:0,y:0,w:10,h:10,rotation:0};
const state={shapes:[shape],rackTypes:[{id:'t',name:'Test',length:5,width:2,height:6,pallets:12}],racks:Array.from({length:8},(_,i)=>({id:String(i),typeId:'t',sectionId:'s',assigned:i<5}))};
assert(racksValid(state));const stats=rackStats(state,'s');assert.equal(stats.used,80);assert.equal(stats.assigned,50);assert.equal(stats.unassigned,30);assert.equal(stats.free,20);assert.equal(stats.pallets,96);
for(const s of [shape,{...shape,type:'triangle',w:20,h:20},{...shape,type:'trapezoid',rotation:31,w:20,h:20},{...shape,type:'l',w:20,h:20,cutW:8,cutH:8,rotation:45}]){const st={...state,shapes:[s]},rs=rackStats(st,'s'),a=allocation(s,rs);assert(Math.abs(area(a.rack)-rs.used)<1e-6);assert(Math.abs(area(a.assigned)-rs.assigned)<1e-6);}
assert(!racksValid({...state,shapes:[{...shape,w:5}]}));assert(!racksValid({...state,rackTypes:[{...state.rackTypes[0],pallets:1.5}]}));assert(!racksValid({...state,racks:[{...state.racks[0],typeId:'missing'}]}));
const blank={...state,racks:state.racks.map(r=>({...r,assigned:false}))};assert.equal(area(allocation(shape,rackStats(blank,'s')).assigned),0);
const full={...state,racks:state.racks.map(r=>({...r,assigned:true}))};assert(Math.abs(area(allocation(shape,rackStats(full,'s')).assigned)-80)<1e-6);
console.log('Passed 50% assigned / 30% unassigned / 20% unracked illustration; rotated and irregular area splits; capacity, type, and reference validation; all assigned and none assigned.');
