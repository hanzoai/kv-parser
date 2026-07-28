import { ReplyError, ParserError } from "@hanzo/kv-errors";

/** How a bulk reply is handed back: as a string, or as the raw bytes. */
type ReturnBuffers = boolean;

interface KVParserOptions {
  /** Called with each decoded reply, in arrival order. */
  returnReply(reply: unknown): void;
  /** Called when the server's reply was an error. */
  returnError(err: ReplyError): void;
  /** Called when a frame cannot be decoded. Defaults to returnError. */
  returnFatalError?(err: ParserError): void;
  /** Return bulk replies as Buffer instead of string. */
  returnBuffers?: ReturnBuffers;
  /** Decode RESP integers as strings, so values past 2^53 survive. */
  stringNumbers?: boolean;
}

/**
 * Decodes the KV wire protocol. Feed it bytes with `execute`; it calls the
 * handlers you supplied for each complete reply. Partial frames are buffered
 * until the rest arrives.
 */
declare class KVParser {
  constructor(options: KVParserOptions);
  /** Feed received bytes. Safe to call with a partial frame. */
  execute(buffer: Buffer): void;
  /** Drop buffered state — use after a connection resets. */
  reset(): void;
  setReturnBuffers(returnBuffers: ReturnBuffers): void;
  setStringNumbers(stringNumbers: boolean): void;
}

export = KVParser;
