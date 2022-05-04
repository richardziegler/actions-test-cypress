/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

//import fs from "fs";
const fs = require("fs");
const {create, queryByPK, queryByPKAndStartingSK, del} = require("../support/app-dynamodb");
//import {create, queryByPK, queryByPKAndStartingSK} from "../support/app-dynamodb";

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars

async function loadTestData(table, dataToLoadFile){
  console.log(`loading data into ${table} using ${dataToLoadFile}`);
  const testData = JSON.parse(fs.readFileSync(dataToLoadFile, "utf-8"));
  //console.log(testData);
  for (const record of testData){
    console.log(`${table}, ${record.PK}, ${record.SK}, ${record.REV}`);
    const res = await create(table, record.PK, record.SK, record.REV, record);
    console.log(res);
  }
  return null;
}

async function deleteTestData(table, dataToDeleteFile){
  console.log(`deleting data from ${table} using ${dataToDeleteFile}`);
  const deletionKeys = JSON.parse(fs.readFileSync(dataToDeleteFile, "utf-8"));
  for (const record of deletionKeys){
    let res, records;
    switch (record.SK[0]){
      case "*":
        console.log("handling *"); 
        res = await queryByPK(table, record.PK);
        //console.log(res);
        records = res?.Items;
        console.log(records);
        break;
      case ">":
        console.log("handling >"); 
        res = await queryByPKAndStartingSK(table, record.PK, record.SK.slice(1), true)
        //console.log(res);
        records = res?.Items;
        console.log(records);
        break;
      case "~":
        console.log("handling ~");
        //generate the timestamp portion of a cuid by subtracting the number given in the SK (format will be '~60' where ~ is the flag indicating time matching and 60 is given seconds)
        const timeLimit = "c" + ((new Date().getTime()) - (record.SK.slice(1) * 1000)).toString(36);
        //retrieve all records created AFTER the timeLimit and delete them
        console.log(timeLimit);
        res = await queryByPKAndStartingSK(table, record.PK, timeLimit, true);
        //console.log(res);
        records = res?.Items;
        console.log(records);
        break;
      default:
        console.log("handling default");
        records = [{PK: record.PK, SK: record.SK, REV: record.REV}];
        console.log(records);
    }
    for (const record of records){
      await del(table, record.PK, record.SK, record.REV);
    }
  }
  return null; 
}

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('task', {
    // deconstruct the individual properties
    loadTestData({ table, dataToLoadFile }) {
      return loadTestData(table, dataToLoadFile);
    },
    deleteTestData({ table, dataToDeleteFile }) {
      return deleteTestData(table, dataToDeleteFile);
    },
  })
}
