package vertx.study.verticle;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Handler;
import io.vertx.core.MultiMap;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonObject;

public class TestVerticle extends AbstractVerticle{

	
	@Override
	public void start() throws Exception {
		System.out.println("테스트 시작");
		JsonObject config = config();
		System.out.println(config.encodePrettily().toString());
		
		vertx.eventBus().consumer("test1").handler(new Handler<Message<Object>>() {
			
			@Override
			public void handle(Message<Object> msg) {
				
			}
		});
		
		vertx.eventBus().<String>consumer("test2").handler(msg -> {
			String body = msg.body();
			System.out.println(body);
			MultiMap header = msg.headers();
			System.out.println(header.toString());
			msg.reply("나왔어!!");
		
		});
	}
	
	public void stop() throws Exception {
		
		System.out.println("*****TestVerticle 끝***");
		
		
	};
}
