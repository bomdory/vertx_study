package vertx.study;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.DeploymentOptions;
import io.vertx.core.Vertx;
import io.vertx.core.eventbus.DeliveryOptions;
import io.vertx.core.json.JsonObject;

public class AdminServer extends AbstractVerticle {

	
	public static void main(String[] args) {
		Vertx.vertx().deployVerticle(AdminServer.class.getName());
		
	}
	
	
	@Override
	public void start() throws Exception {
		System.out.println("hello!!");
		
		DeploymentOptions option = new DeploymentOptions();
		JsonObject config = new JsonObject();
		config.put("aaa", "bbb");
		option.setConfig(config);
		option.setWorker(true);
		option.setInstances(3);
		
		vertx.deployVerticle("vertx.study.verticle.TestVerticle", option , res -> {
			if(res.succeeded()){
				String deployId = res.result();
				DeliveryOptions opt2 = new DeliveryOptions();
				opt2.addHeader("bbb", "ccc");
				vertx.eventBus().<String>send("test2", "받아라!!" ,opt2 ,   res2 -> {
					if(res2.succeeded()){
						String msg = res2.result().body();
						System.out.println(msg);
					}else{
						
						System.out.println(res2.cause().getMessage());
					}
				});
				
				
//				vertx.undeploy(deployId);
			}else{
				
			}
			
		});
		
	}
}
