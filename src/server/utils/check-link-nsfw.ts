import { readFileSync } from "fs"
import path from "path"

export const checkLinkNsfw = (link: string) => {
	const blockList = readFileSync(path.join(process.cwd(), "public", "block-list.txt"))
	const regex = new RegExp(` ${link.replace(/(https:\/\/|(^|\/)www\.)/, "")}`, "gm")
	return regex.test(blockList.toString())
}
