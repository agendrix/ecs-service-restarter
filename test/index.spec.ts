import assert from "assert";
import { SNSEvent } from "aws-lambda";
import { CloudWatchAlarm } from "../lambda/types";
import { fetchAlarmPayload, formatRollRestartCommand } from "../lambda/utils";
import { PAYLOAD, FORMATTED_PAYLOAD } from "./mocks";
import { cloneDeep } from "lodash"

describe("fetchAlarmPayload", () => {
  it("should return an object when the payload is valid", () => {
    const payload = fetchAlarmPayload(PAYLOAD as SNSEvent);
    assert.ok(payload); 
  })

  it("should throw if the event format is not valid", () => {
    const invalidPayload = cloneDeep(PAYLOAD)
    invalidPayload.Records.shift();
    assert.throws(() => (fetchAlarmPayload(invalidPayload)));
  })
});

describe("formatCommandInput", () => {
  it("should return an object when the payload is valid", () => {
    const commandInput = formatRollRestartCommand(FORMATTED_PAYLOAD as CloudWatchAlarm);
    assert.ok(commandInput); 
  })

  it("should throw if the payload format is not valid", () => {
    const invalidPayload = cloneDeep(FORMATTED_PAYLOAD) as any;
    delete invalidPayload.Trigger.Dimensions 
    assert.throws(() => (formatRollRestartCommand(invalidPayload)));
  })


  it("should throw if service or cluster is undefined", () => {
    const invalidPayload = cloneDeep(FORMATTED_PAYLOAD);
    invalidPayload.Trigger.Dimensions.shift();
    assert.throws(() => (formatRollRestartCommand(invalidPayload)));
  })
});