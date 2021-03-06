export class Observable {
  /** Internal implementation detail */
  private _subscribe: any;

  /**
    * @constructor
    * @param {Function} subscribe is the function that is called when the 
    * observable is subscribed to. This function is given a subscriber/observer
    * which provides the three methods on the Observer interface:
    * onNext, onError, and onCompleted
  */
  constructor(subscribe?: any) {
    debugger;
    if (subscribe) {
      this._subscribe = subscribe;
    }
  }

  // public api for registering an observer
  subscribe(onNextOrObserver: any, onError?: any, onCompleted?: any) {
    debugger;
    if (typeof onNextOrObserver === 'function') {
      return this._subscribe({
        onNext: onNextOrObserver,
        onError: onError || (() => { }),
        onCompleted: onCompleted || (() => { })
      });
    } else {
      return this._subscribe(onNextOrObserver);
    }
  }

  static of(...args: any[]): Observable {
    debugger;
    const subscribeFn = (observer: any) => {
      debugger;
      args.forEach(val => observer.onNext(val));
      observer.onCompleted();

      return {
        unsubscribe: () => {
          // just make sure none of the original subscriber's methods are never called.
          observer = {
            onNext: () => { },
            onError: () => { },
            onCompleted: () => { }
          };
        }
      };
    }
    return new Observable(subscribeFn);
  }

  static from(iterable: any): Observable {
    return new Observable((observer: any) => {
      for (let item of iterable) {
        observer.onNext(item);
      }

      observer.onCompleted();

      return {
        unsubscribe: () => {
          // just make sure none of the original subscriber's methods are never called.
          observer = {
            onNext: () => { },
            onError: () => { },
            onCompleted: () => { }
          };
        }
      };
    });
  }

  static fromEvent(source: any, event: any): Observable {
    return new Observable((observer: any) => {
      const callbackFn = (e: any) => observer.onNext(e);

      source.addEventListener(event, callbackFn);

      return {
        unsubscribe: () => source.removeEventListener(event, callbackFn)
      };
    });
  }

  map(projFn): Observable {
    debugger;
    const subscribeFn = (observer) => {
      return this.subscribe(
        (val) => observer.onNext(projFn(val)),
        (e) => observer.onError(e),
        () => observer.onCompleted()
      );
    }
    return new Observable(subscribeFn);
  }

  filter(predicateFn): Observable {
    return new Observable((observer) => {
      return this.subscribe(
        (val) => {
          // only emit the value if it passes the filter function
          if (predicateFn(val)) {
            observer.onNext(val);
          }
        },
        (e) => observer.onError(e),
        () => observer.onCompleted()
      );
    });
  }

  take(count: number): Observable {
    return new Observable((observer) => {
      let currentCount = 0;
      return this.subscribe(
        (val) => {
          if (currentCount < count) {
            observer.onNext(val);
            currentCount++
          } else if (currentCount === count) {
            observer.onCompleted();
            currentCount++
          }
        },
        (e) => observer.onError(e),
        () => observer.onCompleted()
      );
    });
  }

}