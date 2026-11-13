// Nơi DUY NHẤT đọc route meta để dựng điều hướng (§S.1, D38, §V.3).
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import type { RouteMeta, RouteRecordRaw } from 'vue-router'

import { useAuth } from '@features/auth/UseAuth'

import type { RequiredPermission } from '@shared/lib/api/Permission'

export interface NavItem {
  name: string
  path: string
  titleKey: string
  icon: string
}

export interface NavCommand extends NavItem {
  group: 'create' | 'navigate'
}

export interface NavShortcut {
  keys: string[]
  path: string
  titleKey: string
}

interface FlatRoute {
  name: string
  path: string
  meta: RouteMeta
}

/** Trải cây route thành danh sách route có tên, kèm path đầy đủ. */
function flatten(routes: readonly RouteRecordRaw[], parent = ''): FlatRoute[] {
  return routes.flatMap((route) => {
    const path = joinPath(parent, route.path)
    const self = typeof route.name === 'string' ? [{ name: route.name, path, meta: route.meta ?? {} }] : []
    return [...self, ...flatten(route.children ?? [], path)]
  })
}

function joinPath(parent: string, child: string) {
  if (child.startsWith('/')) return child
  if (!child) return parent || '/'
  return `${parent.replace(/\/$/, '')}/${child}`
}

/** Hàm thuần: route + quyền → sidebar, commands, shortcuts, titleOf. */
export function buildNavigation(routes: readonly RouteRecordRaw[], can: (permission: RequiredPermission) => boolean) {
  const allowed = flatten(routes).filter((r) => !r.meta.permission || can(r.meta.permission))

  const commands: NavCommand[] = allowed.flatMap(({ name, path, meta }) =>
    meta.command && meta.titleKey
      ? [
          {
            name,
            path,
            titleKey: meta.titleKey,
            icon: meta.command.icon,
            group: meta.command.group,
          },
        ]
      : [],
  )

  const sidebar: NavItem[] = commands.filter((c) => c.group === 'navigate').map(({ group: _group, ...item }) => item)

  const shortcuts: NavShortcut[] = allowed.flatMap(({ path, meta }) =>
    meta.command?.shortcut && meta.titleKey ? [{ keys: meta.command.shortcut, path, titleKey: meta.titleKey }] : [],
  )

  /** Key i18n cho <title>: titleKey của route con sâu nhất có khai báo. */
  function titleOf(route: { matched: readonly { meta: RouteMeta }[] }): string | null {
    return [...route.matched].reverse().find((record) => record.meta.titleKey)?.meta.titleKey ?? null
  }

  function breadcrumbs(route: {
    path?: string
    params?: Record<string, string | string[] | undefined>
    matched: readonly { path: string; meta: RouteMeta }[]
  }) {
    const ancestors = allowed.flatMap((record) =>
      record.meta.command?.group === 'navigate' &&
      record.meta.titleKey &&
      record.path !== '/' &&
      route.path?.startsWith(`${record.path}/`)
        ? [{ path: record.path, titleKey: record.meta.titleKey }]
        : [],
    )
    const matched = route.matched.flatMap((record) =>
      record.meta.titleKey
        ? [
            {
              path: (record.path || '/').replace(/:([a-zA-Z0-9_]+)/g, (_match, key: string) =>
                encodeURIComponent(String(route.params?.[key] ?? '')),
              ),
              titleKey: record.meta.titleKey,
            },
          ]
        : [],
    )
    const seen = new Set<string>()
    return [...ancestors, ...matched]
      .sort((a, b) => a.path.length - b.path.length)
      .filter((item) => {
        if (seen.has(item.path)) return false
        seen.add(item.path)
        return true
      })
  }

  const sidebarGroups = ([undefined, 'catalog', 'operations', 'administration'] as const)
    .map((group) => ({
      titleKey: group ? `nav.groups.${group}` : null,
      items: sidebar.filter((item) => allowed.find((route) => route.name === item.name)?.meta.sidebarGroup === group),
    }))
    .filter((group) => group.items.length)
  return { sidebar, sidebarGroups, commands, shortcuts, titleOf, breadcrumbs }
}

/** Điều hướng reactive theo quyền của user hiện tại — sidebar, palette, phím tắt chỉ render kết quả này. */
export function useNavigation() {
  const router = useRouter()
  const { can } = useAuth()
  return computed(() => buildNavigation(router.options.routes, can))
}
