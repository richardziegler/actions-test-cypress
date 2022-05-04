"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceAndClear = exports.replace = exports.executeTransaction = exports.prepareReplaceAndClearStatements = exports.prepareReplaceStatements = exports.prepareDelStatement = exports.prepareUpdateStatement = exports.prepareReadStatement = exports.prepareAppendStatement = exports.prepareCreateStatement = exports.queryByPKAndSKBeginsWith = exports.queryByPKAndStartingSK = exports.queryByPK = exports.del = exports.update = exports.read = exports.append = exports.create = void 0;
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, GetCommand, DeleteCommand, TransactWriteCommand, QueryCommand } = require("@aws-sdk/lib-dynamodb");
//start with a default client  - note that addProxyToClient depends on HTTPS_PROXY env variable -- see module docs
let dbClient = new DynamoDBClient();
let dbDocClient = DynamoDBDocumentClient.from(dbClient);
function create(table, pk, sk, rev, item) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield dbDocClient.send(new PutCommand({ TableName: table,
            Item: Object.assign(Object.assign({}, item), { PK: pk, SK: sk, REV: rev }),
            ConditionExpression: "NOT (#pk = :pk AND #sk = :sk)",
            ExpressionAttributeNames: { "#pk": "PK", "#sk": "SK" },
            ExpressionAttributeValues: { ":pk": pk, ":sk": sk } }));
        return data;
    });
}
exports.create = create;
function append(table, pk, sk, rev, lastKnownRevision, item) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield dbDocClient.send(new PutCommand({ TableName: table,
            Item: Object.assign(Object.assign({}, item), { PK: pk, SK: sk, REV: rev, PREV_REV: lastKnownRevision }),
            ConditionExpression: "NOT (#pk = :pk AND #sk = :sk)",
            ExpressionAttributeNames: { "#pk": "PK", "#sk": "SK" },
            ExpressionAttributeValues: { ":pk": pk, ":sk": sk } }));
        return data;
    });
}
exports.append = append;
function read(table, pk, sk) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield dbDocClient.send(new GetCommand({ TableName: table, Key: { PK: pk, SK: sk } }));
        return data === null || data === void 0 ? void 0 : data.Item;
    });
}
exports.read = read;
function update(table, pk, sk, rev, lastKnownRevision, item) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield dbDocClient.send(new PutCommand({ TableName: table,
            Item: Object.assign(Object.assign({}, item), { PK: pk, SK: sk, REV: rev, PREV_REV: lastKnownRevision }),
            ConditionExpression: "#revision = :lastKnownRevision",
            ExpressionAttributeNames: { "#revision": "REV" },
            ExpressionAttributeValues: { ":lastKnownRevision": lastKnownRevision } }));
        return data;
    });
}
exports.update = update;
function del(table, pk, sk, lastKnownRevision) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield dbDocClient.send(new DeleteCommand({ TableName: table,
            Key: { PK: pk, SK: sk },
            ConditionExpression: "#revision = :lastKnownRevision",
            ExpressionAttributeNames: { "#revision": "REV" },
            ExpressionAttributeValues: { ":lastKnownRevision": lastKnownRevision }
        }));
        return data;
    });
}
exports.del = del;
function queryByPK(table, pk) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield dbDocClient.send(new QueryCommand({ TableName: table,
            KeyConditionExpression: "#pk = :pk",
            ExpressionAttributeNames: { "#pk": "PK" },
            ExpressionAttributeValues: { ":pk": pk }
        }));
        return data;
    });
}
exports.queryByPK = queryByPK;
function queryByPKAndStartingSK(table, pk, startingSK, exclusiveStart = false) {
    return __awaiter(this, void 0, void 0, function* () {
        let skOperator = ">=";
        if (exclusiveStart) {
            skOperator = ">";
        }
        const data = yield dbDocClient.send(new QueryCommand({ TableName: table,
            KeyConditionExpression: `#pk = :pk and #sk ${skOperator} :sk`,
            ExpressionAttributeNames: { "#pk": "PK", "#sk": "SK" },
            ExpressionAttributeValues: { ":pk": pk, ":sk": startingSK }
        }));
        return data;
    });
}
exports.queryByPKAndStartingSK = queryByPKAndStartingSK;
function queryByPKAndSKBeginsWith(table, pk, startingSK) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield dbDocClient.send(new QueryCommand({ TableName: table,
            KeyConditionExpression: `#pk = :pk and begins_with(#sk, :sk)`,
            ExpressionAttributeNames: { "#pk": "PK", "#sk": "SK" },
            ExpressionAttributeValues: { ":pk": pk, ":sk": startingSK }
        }));
        return data;
    });
}
exports.queryByPKAndSKBeginsWith = queryByPKAndSKBeginsWith;
function prepareCreateStatement(table, pk, sk, rev, item) {
    const statement = { Put: { TableName: table,
            Item: Object.assign(Object.assign({}, item), { PK: pk, SK: sk, REV: rev }),
            ConditionExpression: "NOT (#pk = :pk AND #sk = :sk)",
            ExpressionAttributeNames: { "#pk": "PK", "#sk": "SK" },
            ExpressionAttributeValues: { ":pk": pk, ":sk": sk } }
    };
    return statement;
}
exports.prepareCreateStatement = prepareCreateStatement;
function prepareAppendStatement(table, pk, sk, rev, lastKnownRevision, item) {
    const statement = { Put: { TableName: table,
            Item: Object.assign(Object.assign({}, item), { PK: pk, SK: sk, REV: rev, PREV_REV: lastKnownRevision }),
            ConditionExpression: "NOT (#pk = :pk AND #sk = :sk)",
            ExpressionAttributeNames: { "#pk": "PK", "#sk": "SK" },
            ExpressionAttributeValues: { ":pk": pk, ":sk": sk } }
    };
    return statement;
}
exports.prepareAppendStatement = prepareAppendStatement;
function prepareReadStatement(table, pk, sk) {
    const statement = { Get: { TableName: table, Key: { PK: pk, SK: sk } } };
    return statement;
}
exports.prepareReadStatement = prepareReadStatement;
function prepareUpdateStatement(table, pk, sk, rev, lastKnownRevision, item) {
    const statement = { Put: { TableName: table,
            Item: Object.assign(Object.assign({}, item), { PK: pk, SK: sk, REV: rev, PREV_REV: lastKnownRevision }),
            ConditionExpression: "#revision = :lastKnownRevision",
            ExpressionAttributeNames: { "#revision": "REV" },
            ExpressionAttributeValues: { ":lastKnownRevision": lastKnownRevision } }
    };
    return statement;
}
exports.prepareUpdateStatement = prepareUpdateStatement;
function prepareDelStatement(table, pk, sk, lastKnownRevision) {
    const statement = { Delete: { TableName: table,
            Key: { PK: pk, SK: sk },
            ConditionExpression: "#revision = :lastKnownRevision",
            ExpressionAttributeNames: { "#revision": "REV" },
            ExpressionAttributeValues: { ":lastKnownRevision": lastKnownRevision }
        }
    };
    return statement;
}
exports.prepareDelStatement = prepareDelStatement;
function prepareReplaceStatements(table, pk, sk, rev, lastKnownRevision, newPK, newSK, newItem) {
    const statements = [];
    //delete the existing item
    statements.push(prepareDelStatement(table, pk, sk, lastKnownRevision));
    //create the new item
    statements.push(prepareCreateStatement(table, newPK, newSK, rev, Object.assign(Object.assign({}, newItem), { PREV_REV: lastKnownRevision })));
    return statements;
}
exports.prepareReplaceStatements = prepareReplaceStatements;
function prepareReplaceAndClearStatements(table, pk, sk, rev, lastKnownRevision, newPK, newSK, newItem, clearPK, clearSK, clearItem) {
    const statements = [];
    //delete the existing item
    statements.push(prepareDelStatement(table, pk, sk, lastKnownRevision));
    //create a "clear" item
    statements.push(prepareCreateStatement(table, clearPK, clearSK, rev, clearItem));
    //create the new item
    statements.push(prepareCreateStatement(table, newPK, newSK, rev, Object.assign(Object.assign({}, newItem), { PREV_REV: lastKnownRevision })));
    return statements;
}
exports.prepareReplaceAndClearStatements = prepareReplaceAndClearStatements;
function executeTransaction(transactionItems) {
    return __awaiter(this, void 0, void 0, function* () {
        const transactionParams = { TransactItems: transactionItems };
        const data = yield dbDocClient.send(new TransactWriteCommand(transactionParams));
        return data;
    });
}
exports.executeTransaction = executeTransaction;
function replace(table, pk, sk, rev, lastKnownRevision, newPK, newSK, newItem) {
    return __awaiter(this, void 0, void 0, function* () {
        let statements;
        statements = prepareReplaceStatements(table, pk, sk, rev, lastKnownRevision, newPK, newSK, newItem);
        return executeTransaction(statements);
    });
}
exports.replace = replace;
function replaceAndClear(table, pk, sk, rev, lastKnownRevision, newPK, newSK, newItem, clearPK, clearSK, clearItem) {
    return __awaiter(this, void 0, void 0, function* () {
        let statements;
        statements = prepareReplaceAndClearStatements(table, pk, sk, rev, lastKnownRevision, newPK, newSK, newItem, clearPK, clearSK, clearItem);
        return executeTransaction(statements);
    });
}
exports.replaceAndClear = replaceAndClear;
