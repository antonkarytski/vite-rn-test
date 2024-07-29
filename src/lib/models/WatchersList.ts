export class WatchersList {
  private list: (() => void)[] = []

  public readonly add = (
    ...watchers: ((() => void) | undefined | false | void)[]
  ) => {
    this.list.push(
      ...(watchers.filter((watcher) => !!watcher) as (() => void)[])
    )
    return
  }

  public readonly unwatchAll = () => {
    this.list.forEach((watcher) => watcher())
    this.list = []
  }
}
