package vertx.study;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.DeploymentOptions;
import io.vertx.core.buffer.Buffer;
import io.vertx.core.file.FileSystem;
import io.vertx.core.http.HttpServerResponse;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.auth.AuthProvider;
import io.vertx.ext.auth.shiro.ShiroAuth;
import io.vertx.ext.auth.shiro.ShiroAuthRealmType;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.ext.web.handler.CookieHandler;
import io.vertx.ext.web.handler.FormLoginHandler;
import io.vertx.ext.web.handler.RedirectAuthHandler;
import io.vertx.ext.web.handler.SessionHandler;
import io.vertx.ext.web.handler.StaticHandler;
import io.vertx.ext.web.handler.UserSessionHandler;
import io.vertx.ext.web.sstore.LocalSessionStore;
import io.vertx.rxjava.core.Vertx;
import vertx.study.verticle.JdbcVerticle;

import java.io.FileReader;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.ConcurrentHashMap;


public class AdminServer extends AbstractVerticle{

	public static void main(String[] args) {
		Vertx.vertx().deployVerticle(AdminServer.class.getName());
	}
	
	@Override
	public void start() throws Exception {
		init();
		
		Router router = Router.router(vertx);
		router.route().handler(CookieHandler.create());
		router.route().handler(BodyHandler.create());
		router.route().handler(SessionHandler.create(LocalSessionStore.create(vertx)));
		AuthProvider authProvider = ShiroAuth.create(vertx, ShiroAuthRealmType.PROPERTIES, new JsonObject());
		router.route().handler(UserSessionHandler.create(authProvider));

		router.route("/admin/*").handler(RedirectAuthHandler.create(authProvider, "/login/"));
		router.route("/admin/*").handler(StaticHandler.create().setCachingEnabled(false).setWebRoot("webroot/admin"));
		router.route("/loginHandler").handler(FormLoginHandler.create(authProvider));
		router.route("/logout").handler(context -> {
					context.clearUser();
					context.response().putHeader("location", "/")
					.setStatusCode(302).end();
				});
		
		router.post("/admin/api/db").handler(this::adminSql);
		router.post("/admin/api").handler(this::adminApi);
//		router.post("/admin/api/verticle").handler(this::verticle);
//		uter.post("/admin/api/status").handler(this::status);
		StaticHandler staticHandler = StaticHandler.create().setCachingEnabled(false);
		router.route().handler(staticHandler);
		vertx.createHttpServer().requestHandler(router::accept).listen(9002);
	}
	
	private Map<String,JsonObject> apiMap = new ConcurrentHashMap<String, JsonObject>();
	private void adminApi(RoutingContext routingContext) {
		HttpServerResponse response = routingContext.response();
		JsonObject input = routingContext.getBody().toJsonObject();
		String name = input.getString("name");
		System.out.println("********adminApi**********"+name);
		
		if(name == null){
			sendError(400,response);
			return;
		}
		response.putHeader("content-type", "application/json");
		JsonObject api = apiMap.get(name);
		if(api != null){
			System.out.println("**********api is not null************");
			String addr = api.getString("ADDRESS");
			String db = api.getString("DB");
			String sql = api.getString("SQL");
			JsonObject msg = new JsonObject();
			if(db != null && db.length() > 0){
				msg.put("db", db);
				msg.put("sql", sql);
			}
			JsonArray parameters = null;
			try {
				parameters = input.getJsonArray("parameters");
			} catch (Exception e) {
			} 
			if(parameters == null){
				parameters = new JsonArray();
			}
			msg.put("parameters", parameters);
			vertx.eventBus().<JsonObject>send(addr, msg , res2 ->{
				if(res2.succeeded()){
					response.end(res2.result().body().encode());
				}else{
					sendError(500, response);
				}
			});
		}else{
		
			JsonObject para = new JsonObject();
			para.put("name", name);
			para.put("db", "admin");
			para.put("sql", "select * from config_api where name = ?");
			para.put("parameters", new JsonArray().add(name));
			vertx.eventBus().<JsonObject>send("db.select", para, res -> {
				if(res.succeeded()){
					JsonObject result = res.result().body();
					List<JsonObject> list = result.getJsonArray("rows").getList();
					if(list.size() > 0){
						JsonObject row = list.get(0);
						apiMap.put(name, row);
						String addr = row.getString("ADDRESS");
						String db = row.getString("DB");
						String sql = row.getString("SQL");
						JsonObject msg = new JsonObject();
						if(db != null && db.length() > 0){
							msg.put("db", db);
							msg.put("sql", sql);
						}
						JsonArray parameters = null;
						try {
							parameters = input.getJsonArray("parameters");
						} catch (Exception e) {
						} 
						if(parameters == null){
							parameters = new JsonArray();
						}
						msg.put("parameters", parameters);
						vertx.eventBus().<JsonObject>send(addr, msg , res2 ->{
							if(res2.succeeded()){
								response.end(res2.result().body().encode());
							}else{
								sendError(500, response);
							}
						});
					}else{
						sendError(500, response);
					}
				}else{
					sendError(500, response);
				}
			});
		}
	}

	
	
	private void adminSql(RoutingContext routingContext) {
		HttpServerResponse response = routingContext.response();
		JsonObject input = routingContext.getBody().toJsonObject();
		String sql= input.getString("sql");
		System.out.println("********admin sql**********"+sql);
		
		if(sql == null){
			sendError(400,response);
			return;
		}
		JsonArray parameters = null;
		try {
			parameters = input.getJsonArray("parameters");
		} catch (Exception e) {
		} 
		if(parameters == null){
			parameters = new JsonArray();
		}
		response.putHeader("content-type", "application/json");
		JsonObject para = new JsonObject();
		para.put("sql", sql);
		para.put("db", "admin");
		para.put("parameters", parameters);
		vertx.eventBus().<JsonObject>send("db.query", para, res -> {
			if(res.succeeded()){
				JsonObject result = res.result().body();
//				System.out.println("*****result****** : "+result);
				response.end(result.encode());
			}else{
				sendError(500, response);
			}
		});
	}

	private void sendError(int statusCode, HttpServerResponse response) {
		response.setStatusCode(statusCode).end();
	}
	
	private void init() {
//		1. deploy jdbcClient
//		2. run script
//		3. deploy verticles
//		4. 
		
		vertx.deployVerticle(JdbcVerticle.class.getName(), new DeploymentOptions().setWorker(true), res ->{
			if(res.succeeded()){
				connectAdminServer(); // -> script
		
//				deploy verticles
//				db connect
			}
		});
		
		
		
		
	}

	private void initDB() {

		String sql = "select * from config_db where auto_Start = true";
		JsonObject message = new JsonObject();
		message.put("db", "admin");
		message.put("sql", sql);
		vertx.eventBus().<JsonObject>send("db.select", message , res ->{
			JsonObject result = res.result().body();
			List<JsonObject> rows = result.getJsonArray("rows").getList();
			for(JsonObject row : rows){
				Map<String, Object> map = row.getMap();
				JsonObject msg = new JsonObject();
				for(String col : map.keySet()){
					msg.put(col.toLowerCase(), map.get(col));
				}
				vertx.eventBus().send("db.connect", msg, res2 -> {
					if(res2.succeeded()){
						System.out.println(res2.result().body());
					}else{
						System.out.println(res2.cause().getMessage());
					}
				});
			}
		});
	}

	private Properties prop;
	private void connectAdminServer() {
		prop = new Properties();
		try {
			prop.load(new FileReader("cfg/admin.properties"));
		} catch (Exception e) {
			e.printStackTrace();
		}
		String driver = prop.getProperty("admin.db.driver");
		String url = prop.getProperty("admin.db.url");
		String user = prop.getProperty("admin.db.user");
		String pw = prop.getProperty("admin.db.password");
		JsonObject config = new JsonObject();
		config.put("driver_class", driver);
		config.put("url", url);
		config.put("user", user);
		config.put("password", pw);
		config.put("name", "admin");
		vertx.eventBus().send("db.connect", config, res -> {
			if(res.succeeded()){
				System.out.println(res.result().body());
//				script();
				initDB();
			}
		});
	}

	private void script() {
		FileSystem fs = vertx.fileSystem();
		Buffer buffer = fs.readFileBlocking("");
	}
	
}
