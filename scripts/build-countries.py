import json,math,sys
from pathlib import Path
s=json.loads(Path(sys.argv[1]).read_text());sx,sy=s['transform']['scale'];tx,ty=s['transform']['translate'];arcs=[]
for arc in s['arcs']:
 x=y=0;points=[]
 for dx,dy in arc:x+=dx;y+=dy;points.append([round(x*sx+tx,4),round(y*sy+ty,4)])
 arcs.append(points)
def ring(indices):
 out=[]
 for i in indices:
  a=arcs[i] if i>=0 else arcs[~i][::-1]
  out+=a if not out else a[1:]
 return out
def simplify(points,tol):
 if len(points)<5:return points
 def rdp(p):
  if len(p)<3:return p
  x,y=p[0];xx,yy=p[-1];dx=xx-x;dy=yy-y;l=dx*dx+dy*dy
  best=0;idx=0
  for i,(a,b) in enumerate(p[1:-1],1):
   t=max(0,min(1,((a-x)*dx+(b-y)*dy)/l)) if l else 0
   d=(a-x-t*dx)**2+(b-y-t*dy)**2
   if d>best:best=d;idx=i
  if best>tol*tol:return rdp(p[:idx+1])[:-1]+rdp(p[idx:])
  return [p[0],p[-1]]
 mid=len(points)//2
 out=rdp(points[:mid+1])[:-1]+rdp(points[mid:])
 return out if len(out)>=4 else points
# Preserve topology's original modest-resolution boundaries; no external geocoder.
records=[]
for g in s['objects']['countries']['geometries']:
 if g['type']=='Polygon':coords=[ring(a) for a in g['arcs']]
 else:coords=[[ring(a) for a in poly] for poly in g['arcs']]
 points=[p for poly in (coords if g['type']=='MultiPolygon' else [coords]) for r in poly for p in r]
 xs=[p[0] for p in points];ys=[p[1] for p in points]
 tol=.002 if max(max(xs)-min(xs),max(ys)-min(ys))<2 else .025
 coords=[[simplify(r,tol) for r in poly] for poly in coords] if g['type']=='MultiPolygon' else [simplify(r,tol) for r in coords]
 circle=sorted(set(x%360 for x in xs));gaps=[circle[(i+1)%len(circle)]+(360 if i==len(circle)-1 else 0)-x for i,x in enumerate(circle)];gap=max(range(len(gaps)),key=gaps.__getitem__);left=circle[(gap+1)%len(circle)];right=circle[gap]+(360 if circle[gap]<left else 0);shift=-360 if (left+right)/2>180 else 0;left+=shift;right+=shift;mid=(left+right)/2
 def unwrap(r):return [[round(x+360*round((mid-x)/360),4),y] for x,y in r]
 coords=[[unwrap(r) for r in poly] for poly in coords] if g['type']=='MultiPolygon' else [unwrap(r) for r in coords]
 records.append({'id':str(g.get('id','')),'name':g['properties']['name'],'bounds':[[max(-85,min(ys)),left],[min(85,max(ys)),right]],'geometry':{'type':g['type'],'coordinates':coords}})
Path('dist/countries.js').write_text('export const countries='+json.dumps(records,separators=(',',':'),ensure_ascii=False)+';\n')
print(len(records),'countries and territories;',Path('dist/countries.js').stat().st_size,'bytes')
