import { useEffect, useState } from "react";

// This hook is used to determine if the component has been hydrated.
// Because useEffects will only be executed on client side.
// We sometimes need this info for performant e2e tests.
export const useHydratedFlag = () => {
	const [flag, setFlag] = useState(false);

	useEffect(() => {
		setFlag(true);
	}, []);

	return flag;
};
