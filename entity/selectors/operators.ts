import { Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, pluck, switchMap, withLatestFrom } from 'rxjs/operators';
import { IStateProps, IStateEntity, IStatusProps } from '@xangular-store/entity/types';


type selectorType<AppState> = (state: AppState, props?: IStatusProps) => any;

export function onStatus<AppState>(statusSelector: selectorType<AppState>, stateSelector: selectorType<AppState>, props?: IStateProps) {

  return function selectOperator(source$: Observable<AppState>): Observable<IStateEntity> {
    let mapped$: Observable<any>;

    const state$ = source$.pipe(map(source => stateSelector(source, <IStatusProps>props)));

    mapped$ = source$.pipe(
      map(source => statusSelector(source, <IStatusProps>props)),
      filter(Boolean),
      distinctUntilChanged(),
      withLatestFrom(state$, (status, state) => state)
    );


    return mapped$;
  };

}
