import { Observable } from "./observable";

debugger;
const stream$ = Observable.of(1,2,3,4);
debugger;
const mappedStream$ = stream$.map(x => x+x);
debugger;
mappedStream$.subscribe({
  onNext: val => console.log('new value', val),
  onError: err => console.error('error', err),
  onCompleted: _ => console.log('completed')
});