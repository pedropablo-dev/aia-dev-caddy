import { Skeleton } from "@/components/ui/skeleton"

export function SidebarSkeleton() {
    return (
        <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col">
            <div className="p-4 border-b border-gray-800">
                <div className="flex items-center gap-3 mb-3">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-6 w-40" />
                </div>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-9 w-full mt-2" />
            </div>

            <div className="flex-1 p-2 space-y-2">
                <Skeleton className="h-4 w-20 ml-3 mb-3" />
                {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full rounded-lg" />
                ))}
            </div>

            <div className="p-2 border-t border-gray-800 space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
    )
}

export function CommandCardSkeleton() {
    return (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-6 w-48" />
                </div>
                <Skeleton className="h-9 w-20 rounded-md" />
            </div>
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-full" />
        </div>
    )
}

export function CommandListSkeleton() {
    return (
        <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
                <CommandCardSkeleton key={i} />
            ))}
        </div>
    )
}

export function DashboardSkeleton() {
    return (
        <div className="min-h-screen bg-gray-950 text-gray-100">
            <div className="max-w-7xl mx-auto flex h-screen">
                <SidebarSkeleton />

                {/* Central Panel */}
                <div className="flex-1 flex flex-col bg-gray-950">
                    {/* Header Skeleton */}
                    <div className="p-6 border-b border-gray-800">
                        <Skeleton className="h-12 w-full rounded-lg" />
                    </div>

                    {/* Command List Skeleton */}
                    <div className="flex-1 overflow-hidden">
                        <CommandListSkeleton />
                    </div>
                </div>
            </div>
        </div>
    )
}
