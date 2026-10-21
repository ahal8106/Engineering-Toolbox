export const VERSION = '1.1.1';
export const units = {
 length:{mm:.001,cm:.01,m:1,km:1000,in:.0254,ft:.3048,yd:.9144,mi:1609.344},
 area:{'mm²':1e-6,'cm²':1e-4,'m²':1,'in²':.00064516,'ft²':.09290304,'yd²':.83612736,acre:4046.8564224},
 volume:{'mm³':1e-9,cc:1e-6,mL:1e-6,L:.001,'m³':1,'in³':.000016387064,'ft³':.028316846592,'yd³':.764554857984,'US gal':.003785411784,'Imp gal':.00454609,'US qt':.000946352946,'US cup':.0002365882365,'US fl oz':.0000295735295625},
 mass:{mg:1e-6,g:.001,kg:1,oz:.028349523125,lb:.45359237},
 temperature:{'°C':1,'°F':1,K:1},delta:{'Δ°C':1,'Δ°F':5/9,K:1,'°R':5/9},
 pressure:{Pa:1,kPa:1000,MPa:1e6,bar:1e5,psi:6894.757293168,'inH₂O (4°C)':249.08891,atm:101325},
 energy:{J:1,kJ:1000,MJ:1e6,Wh:3600,kWh:3.6e6,'BTU (IT)':1055.05585262},
 power:{W:1,kW:1000,MW:1e6,'hp (mechanical)':745.6998715822702,'BTU/hr':.2930710701722222,'ton refrigeration':3516.8528420667},
 volumeFlow:{'L/min':.001/60,'L/hr':.001/3600,'m³/hr':1/3600,'m³/s':1,'US GPM':.003785411784/60,'Imp GPM':.00454609/60,CFM:.028316846592/60},
 massFlow:{'kg/s':1,'kg/min':1/60,'kg/hr':1/3600,'lb/s':.45359237,'lb/min':.45359237/60,'lb/hr':.45359237/3600},
 torque:{'N·m':1,'N·mm':.001,'lbf·ft':1.3558179483314,'lbf·in':.11298482902762},
 force:{N:1,kN:1000,lbf:4.4482216152605,kgf:9.80665},
 speed:{'m/s':1,'km/h':1/3.6,mph:.44704,'ft/s':.3048},
 density:{'kg/m³':1,'g/cm³':1000,'kg/L':1000,'lb/ft³':16.01846337396,'lb/US gal':119.826427316},
 dynamicViscosity:{'Pa·s':1,'mPa·s':.001,cP:.001,P:.1},kinematicViscosity:{'m²/s':1,cSt:1e-6,St:1e-4},
 frequency:{Hz:1,kHz:1000,MHz:1e6,rpm:1/60,'rad/s':1/(2*Math.PI)},
 cp:{'kJ/(kg·K)':1000,'J/(kg·K)':1,'BTU/(lb·°F)':4186.8},
 time:{s:1,min:60,hr:3600,day:86400},
 storage:{B:1,kB:1000,MB:1e6,GB:1e9,TB:1e12,KiB:1024,MiB:1024**2,GiB:1024**3,TiB:1024**4}
};
export function number(value,label='Value',min=-Infinity,strict=false){
 if(value===null||value===undefined||String(value).trim()==='')throw Error(`Enter ${label.toLowerCase()}.`);
 const n=Number(value);if(!Number.isFinite(n))throw Error(`${label} must be a finite number.`);
 if(strict?n<=min:n<min)throw Error(`${label} must be ${strict?'greater than':'at least'} ${min}.`);return n;
}
export function si(value,unit,group,label='Value',min=-Infinity,strict=false){if(!Object.hasOwn(units[group]||{},unit))throw Error('Choose a valid unit.');return number(value,label,min,strict)*units[group][unit];}
export function convert(value,from,to,group){const n=number(value);if(!Object.hasOwn(units[group]||{},from)||!Object.hasOwn(units[group],to))throw Error('Choose valid units.');if(group==='temperature'){const k=from==='°C'?n+273.15:from==='°F'?(n-32)*5/9+273.15:n;if(k< -1e-10)throw Error('Temperature cannot be below absolute zero.');return to==='K'?k:to==='°C'?k-273.15:(k-273.15)*9/5+32;}return n*units[group][from]/units[group][to];}
export function geometry(shape,d){const val=k=>number(d[k],k,0,true);let area,volume;
 if(shape==='rectangle')area=val('length')*val('width');
 else if(shape==='circle')area=Math.PI*val('diameter')**2/4;
 else if(shape==='box'){area=val('length')*val('width');volume=area*val('height');}
 else if(shape==='cylinder'){area=Math.PI*val('diameter')**2/4;volume=area*val('length');}
 else if(shape==='tube'){const od=val('od'),id=number(d.id,'Inside diameter',0);if(id>=od)throw Error('Inside diameter must be smaller than outside diameter.');area=Math.PI*(od**2-id**2)/4;volume=area*val('length');}
 else throw Error('Choose a shape.');return {area,volume};
}
export function thermal(mode,{q,m,cp,dt}){cp=number(cp,'Specific heat',0,true);if(mode==='q')return number(m,'Mass flow',0,true)*cp*number(dt,'Temperature change');if(mode==='m'){dt=number(dt,'Temperature change');if(dt===0)throw Error('Temperature change must be nonzero to solve for flow.');const flow=number(q,'Heat transfer')/(cp*dt);return number(flow,'Calculated flow',0,true);}if(mode==='dt')return number(q,'Heat transfer')/(number(m,'Mass flow',0,true)*cp);if(mode==='cp'){m=number(m,'Mass flow',0,true);dt=number(dt,'Temperature change');if(dt===0)throw Error('Temperature change must be nonzero to solve for specific heat.');return number(number(q,'Heat transfer')/(m*dt),'Calculated specific heat',0,true);}throw Error('Choose a solve mode.');}
export function sensor(x,x1,x2,y1,y2){[x,x1,x2,y1,y2]=[x,x1,x2,y1,y2].map(v=>number(v));if(x1===x2)throw Error('The two signal points must be different.');const slope=(y2-y1)/(x2-x1),offset=y1-slope*x1;return {value:slope*x+offset,slope,offset,outside:x<Math.min(x1,x2)||x>Math.max(x1,x2)};}
export function pipe({flow,diameter,length,rho,mu,roughness,k,efficiency}){
 flow=number(flow,'Flow',0);diameter=number(diameter,'Inside diameter',0,true);length=number(length,'Pipe length',0);rho=number(rho,'Density',0,true);mu=number(mu,'Dynamic viscosity',0,true);roughness=number(roughness,'Roughness',0);k=number(k,'Minor loss coefficient',0);efficiency=number(efficiency,'Pump efficiency',0,true);if(efficiency>1)throw Error('Pump efficiency cannot exceed 100%.');if(roughness/diameter>.05)throw Error('Relative roughness must be 0.05 or less for this model.');
 const velocity=flow/(Math.PI*diameter**2/4),re=rho*velocity*diameter/mu;
 if(flow===0)return {velocity:0,re:0,f:0,dp:0,head:0,hydraulic:0,shaft:0,regime:'No flow'};
 if(re>=2300&&re<4000)return {velocity,re,regime:'Transitional — pressure drop is not estimated'};
 let f;if(re<2300)f=64/re;else {let x=7;for(let i=0;i<80;i++){let next=-2*Math.log10(roughness/diameter/3.7+2.51*x/re);if(Math.abs(next-x)<1e-12){x=next;break;}x=next;}f=1/(x*x);}
 const dp=(f*length/diameter+k)*rho*velocity**2/2;return {velocity,re,f,dp,head:dp/(rho*9.80665),hydraulic:dp*flow,shaft:dp*flow/efficiency,regime:re<2300?'Laminar':'Turbulent'};
}
export function logging(ch,rate,bytes,duration,overhead){ch=number(ch,'Channels',1);if(!Number.isInteger(ch))throw Error('Channels must be a whole number.');rate=number(rate,'Sample rate',0);bytes=number(bytes,'Bytes per sample',1);duration=number(duration,'Duration',0);overhead=number(overhead,'Overhead',0);const raw=ch*rate*bytes;return {rate:raw,total:raw*duration,planned:raw*duration*(1+overhead/100)};}
