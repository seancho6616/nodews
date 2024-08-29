module.exports = {
    glist_select:'select id, name, price, type, date_format(gdate, "%Y년%m월%d일") as gdate, developer, distri, img from glist',
    glist_select_one:'select id, name, price, type, date_format(gdate, "%Y년%m월%d일") as gdate, developer, distri, img from glist where id = ?',
    glist_insert:'INSERT INTO glist VALUES (0,?,?,?,?,?,?,?)',
    glist_update:'UPDATE glist SET pwd=?, name=?, acc=? WHERE id=?',
    glist_delete:'DELETE FROM glist WHERE id = ?',

    lib_select: 'SELECT id, gameName, userid, img from lib',
    lib_select_one: 'SELECT id, gameName, img from lib WHERE userid = ?',
    lib_insert: 'INSERT INTO lib VALUES (0, ?,?,?)',
    item_update: 'UPDATE item SET name=?, price=?, imgname=? WHERE id=?',
    item_delete: 'DELETE FROM item WHERE id=?',

    deal_select:'select id, gameName, userid, price, img from deal ',
    deal_insert:'insert into deal values (0,?,?,?,?)',

    cart_select:'select userid, gameName, price, img from cart',
    cart_select_one:'select gameName, price, img from cart where userid=?',
    cart_insert:'insert into cart values (?, ?, ?, ? )',
    cart_delete:'delete from cart where gameName = ?',
    cart2_delete:'delete from cart where userid = ?',

    cust_select:'SELECT * FROM cust',
    cust_select_one:'SELECT * FROM cust WHERE id = ?',
    cust_insert:'INSERT INTO cust VALUES (?,?,?,?,?)',
    cust_update:'UPDATE cust SET pw=?, name=?, email=?, acc=? WHERE id=?',
    cust_delete:'DELETE FROM cust WHERE id = ?'

}       






