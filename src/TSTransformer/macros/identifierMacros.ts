import * as lua from "LuaAST";
import { IdentifierMacro, MacroList } from "TSTransformer/macros/types";

export const IDENTIFIER_MACROS: MacroList<IdentifierMacro> = {
	PKG_VERSION: state => lua.string(state.compileState.pkgVersion ?? "0.0.0"),
	Promise: state => state.TS("Promise"),
};
