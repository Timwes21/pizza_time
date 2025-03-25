import { Tracking } from "dominos";

const tracking=new Tracking();

const trackingResult=await tracking.byPhone('7726210972');

console.dir(trackingResult,{depth:1});

