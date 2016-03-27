package vertx.study.verticle;

import java.io.StringReader;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import net.sf.jsqlparser.JSQLParserException;
import net.sf.jsqlparser.parser.CCJSqlParserManager;
import net.sf.jsqlparser.statement.select.Select;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.jdbc.JDBCClient;
import io.vertx.ext.sql.ResultSet;
import io.vertx.ext.sql.SQLConnection;
import io.vertx.ext.sql.UpdateResult;

public class JdbcVerticle extends AbstractVerticle{

	private Map<String,JDBCClient> jdbcMap = new ConcurrentHashMap<String, JDBCClient>();
	@Override
	public void start() throws Exception {

		vertx.eventBus().<JsonObject>consumer("db.connect", msg -> {
			JsonObject config = msg.body();
			String name = "" + config.remove("name");
			JDBCClient client = JDBCClient.createNonShared(vertx, config);
			client.getConnection(h -> {
				if(h.succeeded()){
					h.result().close();
					msg.reply("["+name+"] connected!!");
					jdbcMap.put(name, client);
				}else{
					msg.fail(0, h.cause().getMessage());
				}
			});
		});

		vertx.eventBus().<JsonObject>consumer("db.select", msg -> {
			JsonObject body = msg.body();
			String db = body.getString("db");
			String sql = body.getString("sql");
			if(isSelect(sql) == false){
				msg.fail(0, "this sql is not select type!!!");
				return;
			}
			JsonArray parameters = body.getJsonArray("parameters");
			JDBCClient client = jdbcMap.get(db);
			if (client == null) {
				msg.fail(0, "["+db+"] no such db!!");
				return;
			}
			client.getConnection(res -> {
				if (res.failed()) {
					msg.fail(0, res.cause().getMessage());
					return;
				}
				SQLConnection conn = res.result();
				conn.queryWithParams(sql, parameters, query -> {
					if (query.succeeded()) {
						ResultSet result = query.result();
						msg.reply(result.toJson());
					} else {
						msg.fail(0, query.cause().getMessage());
					}
				});
				conn.close();
			});
		});
		
		vertx.eventBus().<JsonObject>consumer("db.update", msg -> {
			JsonObject body = msg.body();
			String db = body.getString("db");
			String sql = body.getString("sql");
			JsonArray parameters = body.getJsonArray("parameters");
			JDBCClient client = jdbcMap.get(db);
			if (client == null) {
				msg.fail(0, "["+db+"] no such db!!");
				return;
			}
			client.getConnection(res -> {
				if (res.failed()) {
					msg.fail(0, res.cause().getMessage());
					return;
				}
				SQLConnection conn = res.result();
				conn.updateWithParams(sql, parameters, query -> {
					if (query.succeeded()) {
						 UpdateResult result = query.result();
						msg.reply(result.toJson());
					} else {
						msg.fail(0, query.cause().getMessage());
					}
				});
				conn.close();
			});
		});
		
		vertx.eventBus().consumer("db.query", msg -> {
			JsonObject body = (JsonObject) msg.body();
			String sql = body.getString("sql");
			if(isSelect(sql)){
				vertx.eventBus().send("db.select", body, res ->{
					if(res.succeeded()){
						msg.reply(res.result().body());
					}else{
						msg.fail(0, res.cause().getMessage());
					}
				});
			}else{
				vertx.eventBus().send("db.update", body, res ->{
					if(res.succeeded()){
						msg.reply(res.result().body());
					}else{
						msg.fail(0, res.cause().getMessage());
					}
				});
			}
		});
		
	}

	private boolean isSelect(String sql) {
		boolean isSelect = false;
		CCJSqlParserManager pm = new CCJSqlParserManager();
		try {
			net.sf.jsqlparser.statement.Statement statement = pm.parse(new StringReader(sql));
			if (statement instanceof Select) {
				isSelect = true;
			}
		} catch (JSQLParserException e) {
			e.printStackTrace();
		}
		return isSelect;
	}

}
