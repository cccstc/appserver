import Rx from "@reactivex/rxjs";
import {MySQLQueryObservable} from "./database";

const WordpressRowsReduceObservable = (rows) =>
  Rx.Observable.from(
    rows
      .map(row => {
        const matched = row.meta_key.match(/services_([0-9]+)_(.*)/);
        if (matched === null) {
          return null;
        } else {
          const data = {};
          data[matched[2]] = row.meta_value;
          return { id: matched[1], data: data };
        }
      })
      .filter(row => row !== null)
      .reduce((prev, curr) => {
        const item = prev[curr.id] || {};
        prev[curr.id] = Object.assign({}, item, curr.data);
        return prev;
      }, [])
  );


export const ListBooklet = (conn) => () =>
  MySQLQueryObservable(conn)
    (`
      SELECT meta_key, meta_value
      FROM wp_postmeta
      WHERE post_id = 212
        AND (
          meta_key LIKE 'services_%_date'
          OR meta_key LIKE 'services_%_session'
          OR meta_key LIKE 'services_%_content'
          OR meta_key LIKE 'services_%_booklet'
        );
    `)
    .map(result => WordpressRowsReduceObservable(result.rows))
    .mergeAll();
