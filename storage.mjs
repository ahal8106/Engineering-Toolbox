const DB_NAME='halseyworx-engineering-toolbox';
export function openStore(){return new Promise((resolve,reject)=>{const req=indexedDB.open(DB_NAME,1);let settled=false;const timer=setTimeout(()=>{settled=true;reject(Error('Storage did not open. Close other toolbox tabs and reload.'));},5000);req.onupgradeneeded=()=>{req.result.createObjectStore('calculations',{keyPath:'id'});req.result.createObjectStore('drafts');};req.onerror=()=>{clearTimeout(timer);reject(req.error);};req.onblocked=()=>{clearTimeout(timer);settled=true;reject(Error('Close other toolbox tabs and reload to update storage.'));};req.onsuccess=()=>{clearTimeout(timer);if(settled){req.result.close();return;}const db=req.result;db.onversionchange=()=>db.close();resolve({
 run(store,mode,fn){return new Promise((res,rej)=>{let result;const tx=db.transaction(store,mode);try{const req=fn(tx.objectStore(store));if(req)req.onsuccess=()=>{result=req.result;};}catch(e){tx.abort();rej(e);return;}tx.oncomplete=()=>res(result);tx.onerror=()=>rej(tx.error);tx.onabort=()=>rej(tx.error||Error('Save cancelled.'));});},
 all(){return this.run('calculations','readonly',s=>s.getAll());},
 put(record){return this.run('calculations','readwrite',s=>s.put(record));},
 remove(id){return this.run('calculations','readwrite',s=>s.delete(id));},
 draft(tool,data){return this.run('drafts','readwrite',s=>s.put(data,tool));},
 getDraft(tool){return this.run('drafts','readonly',s=>s.get(tool));},
 import(records){return this.run('calculations','readwrite',s=>{records.forEach(r=>s.add(r));});}
 });};});}
export function readPreferences(){try{return JSON.parse(localStorage.getItem('toolboxPreferences')||'{}')||{};}catch{return {};}}
export function writePreferences(prefs){try{localStorage.setItem('toolboxPreferences',JSON.stringify(prefs));return true;}catch{return false;}}
