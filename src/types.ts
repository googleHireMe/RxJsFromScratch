export interface Observer<T> {
  onNext: (value: T) => void;
  onError: (error: any) => void;
  onCompleted: () => void;
}