import Rx from "@reactivex/rxjs";


export const MySQLQueryObservable = (conn) => (query) =>
  Rx.Observable.create(subscriber => {
    conn.query(query, function(err, rows, fields) {
      if (err) {
        subscriber.error(err);
        subscriber.complete();
        return;
      }
      subscriber.next({rows, fields});
      subscriber.complete();
    });
  });
