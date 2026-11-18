// Older disabled sections were reserved before a separate working-area flag existed.
export const isWorkingArea=s=>s.workingArea??s.rackPlacement===false;
export const allowsRacks=s=>s.rackPlacement!==false&&!isWorkingArea(s);
