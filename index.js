import express from "express";
import { graphqlExpress } from "apollo-server-express";
import { apolloUploadExpress } from "apollo-upload-server";
import bodyParser from "body-parser";
import logger from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";

import schema from "./src/schema";
import {
	instrument,
	report,
	createContext,
	instrumentMiddleware
} from "./src/graphql/monitor";
import memoize from "./src/graphql/memoize";
import heritFromInterface from "./src/graphql/heritFromInterface";

import { execute, subscribe } from "graphql";
import { PubSub } from "graphql-subscriptions";
import {
	SubscriptionServer,
	SubscriptionManager
} from "subscriptions-transport-sse";

import { join } from "path";
import { MongoClient } from "mongodb";
import JwtStrategy from "./src/auth/JwtStrategy";
import AnonymousStrategy from "passport-anonymous";
import { FileStorage, MinioStorage } from "./src/storage";

const {
	MINIO_ENDPOINT,
	MINIO_PORT,
	MINIO_KEY,
	MINIO_SECRET,
	MINIO_SECURE,
	MINIO_BUCKET
} = process.env;

heritFromInterface(schema);
memoize(schema);
instrument(schema);

const url = "mongodb://localhost:27017/popcornmoe_backend";
const app = express();
let storage;

if (MINIO_ENDPOINT) {
	console.log("Using Minio Storage");
	storage = new MinioStorage({
		endPoint: MINIO_ENDPOINT,
		port: MINIO_PORT,
		secure: MINIO_SECURE === "true",
		accessKey: MINIO_KEY,
		secretKey: MINIO_SECRET,
		bucketName: MINIO_BUCKET
	});
} else {
	console.log("Using File Storage");
	storage = new FileStorage(join(__dirname, "uploads"));
}

export const pubsub = new PubSub();

storage.register(app);
app.use(logger("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
	cors({
		origin: true,
		credentials: true
	})
);

app.use(passport.initialize());
passport.serializeUser((user, cb) => cb(null, user));
passport.use(new AnonymousStrategy());

SubscriptionServer(
	{
		onSubscribe: (msg, params) => console.log(msg, params),
		subscriptionManager: new SubscriptionManager({
			schema,
			pubsub
		})
	},
	{
		express: app,
		path: "/subscriptions"
	}
);

MongoClient.connect(url).then(db => {
	app.use((req, res, next) => {
		req.db = db;
		req.storage = storage;
		req.pubsub = pubsub;
		next();
	});
	app.post(
		"/graphql",
		passport.authenticate(["jwt", "anonymous"]),
		apolloUploadExpress(),
		instrumentMiddleware((req, res, next) =>
			graphqlExpress({
				schema,
				context: req,
				tracing: true,
				formatError(e) {
					console.error(e);
					return e;
				}
			})(req, res, next)
		)
	);
	passport.use(new JwtStrategy(db.collection("users")));

	console.log("Connected on mongodb");
});

app.listen(3030, () => console.log("Listening on port 3030"));

process.on("unhandledRejection", error =>
	console.error("unhandledRejection", error)
);
