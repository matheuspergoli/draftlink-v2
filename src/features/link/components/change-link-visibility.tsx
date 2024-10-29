import React from "react"

import { useDebouncedCallback } from "use-debounce"

import { api } from "@/libs/trpc"
import { Switch } from "@/shared/ui/switch"

interface ChangeLinkVisibilityProps {
	linkId: string
	visibility: boolean
}

export const ChangeLinkVisibility = (props: ChangeLinkVisibilityProps) => {
	const utils = api.useUtils()
	const [visibility, setVisibility] = React.useState(props.visibility)

	const { mutate } = api.link.changeVisibility.useMutation({
		onSettled: () => {
			utils.link.invalidate()
		}
	})

	const debouncedMutation = useDebouncedCallback(mutate, 750)

	return (
		<Switch
			checked={visibility}
			onCheckedChange={(value) => {
				setVisibility(value)
				debouncedMutation({ linkId: props.linkId, visibility: value })
			}}
		/>
	)
}
