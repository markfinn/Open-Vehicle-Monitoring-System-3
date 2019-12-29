//#!js
exports.installChargeHandler = function(){
        function ChargeHandler(){

                this.handler = function handler(msg, data){
                        var soc = OvmsMetrics.AsFloat("v.b.soc");
                        var charging = OvmsMetrics.Value("v.c.charging").toUpperCase()==="YES";
                        print("Event: "+msg+" soc: "+soc+" chging: "+charging+" thisstate: "+this.state+"\n");
                        
                        if (charging && soc >= 90)
                        {
                                var now = OvmsMetrics.AsFloat("m.monotonic");
                                if (now - this.laststop > 600)
                                {
                                        print("ChargeHandler stop charge\n");
                                        OvmsVehicle.StopCharge();
                                        this.laststop = now;
                                }
                                if (null!=this.event60)
                                {
                                        PubSub.unsubscribe(this.event60)
                                        this.event60 = null; 
                                }
                        }
                        else if (charging)
                        {
                                if (null==this.event60)
                                {
                                        print("ChargeHandler start monitoring\n");
                                        this.event60 = PubSub.subscribe("ticker.60",this.handler.bind(this));
                                }
                        }
                        else//not charging
                        {
                                if (null!=this.event60)
                                {
                                        PubSub.unsubscribe(this.event60)
                                        this.event60 = null; 
                                }
                        }



                }

                this.uninstall = function uninstall(){
                        print("ChargeHandler uninstall\n");
                        if (null!=this.eventStart)
                        {
                                PubSub.unsubscribe(this.eventStart)
                                this.eventStart = null; 
                        }
                        if (null!=this.eventStop)
                        {
                                PubSub.unsubscribe(this.eventStop)
                                this.eventStop = null; 
                        }
                        if (null!=this.event600)
                        {
                                PubSub.unsubscribe(this.event600)
                                this.event600 = null; 
                        }
                        if (null!=this.event60)
                        {
                                PubSub.unsubscribe(this.event60)
                                this.event60 = null; 
                        }
                }

                print("ChargeHandler install\n");
                this.eventStart = PubSub.subscribe("vehicle.charge.start",this.handler.bind(this));
                this.eventStop = PubSub.subscribe("vehicle.charge.stop",this.handler.bind(this));
                this.event600 = PubSub.subscribe("ticker.600",this.handler.bind(this));
                this.event60 = PubSub.subscribe("ticker.60",this.handler.bind(this));
                this.state = 13;
                this.laststop = 0;
                }

        if (globalThis.chargeHandler && globalThis.chargeHandler.uninstall)
                globalThis.chargeHandler.uninstall()
        globalThis.chargeHandler = new ChargeHandler();

}



/*
OVMS.OvmsConfig": {
    "Delete": function Delete() { [native code] },
    "Get": function Get() { [native code] },
    "Instances": function Instances() { [native code] },
    "Params": function 
    
    
    
    "OvmsMetrics": {
    "AsFloat": function AsFloat() { [native code] },
    "AsJSON": function AsJSON() { [native code] },
    "Value": function Valu
    
 

string = OvmsMetrics.Get(param,instance,default)
*/

