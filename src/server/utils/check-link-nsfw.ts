import { readFileSync } from "fs"
import path from "path"

export const checkLinkNsfw = (link: string) => {
	const blockList = readFileSync(path.join(__dirname, "../../../public/block-list.txt"))
	const regex = new RegExp(` ${link.replace(/(https:\/\/|(^|\/)www\.)/, "")}`, "gm")
	return regex.test(blockList.toString())
}
