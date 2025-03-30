/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import {ReactNode} from 'react'

// ** Types
import type {ACLObj, AppAbility} from 'src/configs/acl'
import BlankLayout from "src/views/layouts/BlankLayout";
import NotAuthorize from 'src/pages/401'
import {useAuth} from "src/hooks/useAuth";
import {buildAbilityFor} from "src/configs/acl";
import {useRouter} from "next/router";
import {AbilityContext} from "src/components/acl/Can";

interface AclGuardProps {
    children: ReactNode
    authGuard?: boolean
    guestGuard?: boolean
    aclAbilities: ACLObj
}

const AclGuard = (props: AclGuardProps) => {
    // ** Props
    const {aclAbilities, children, guestGuard = false, authGuard = true} = props
    const auth = useAuth()
    const router = useRouter()
    const permissionUser = auth.user?.role ?? "USER"
    let ability: AppAbility
    if (auth.user && !ability) {
        ability = buildAbilityFor(permissionUser, aclAbilities.subject)
    }

    if (guestGuard || router.route === "/500" || router.route === "/404" || authGuard === "false") {
        if (auth.user && ability) {
            return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
        } else {
            return <>{children}</>
        }
    }

    if (ability && auth.user && ability.can(aclAbilities.action, aclAbilities.subject)) {
        return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
    }

    return <BlankLayout>
        {children}
    </BlankLayout>
}

export default AclGuard
