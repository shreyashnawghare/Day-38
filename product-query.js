// use database_name

// db.createCollection("product");

// 1 Find all the information about each products

db.products.find({});

// 2. Find the product price which are between 400 to 800

db.products.find({ product_price: { $gte: 400, $lte: 800 } });

// 3. Find the product price which are not between 400 to 600

db.products.find({ product_price: { $not: { $gte: 400, $lte: 600 } } });

// 4. List the four product which are grater than 500 in price

db.products.find({ product_price: { $gte: 500 } }).limit(4);

// 5. Find the product name and product material of each products

db.products.find({}).project({ _id: 0, product_name: 1, product_material: 1 });

// 6. Find the product with a row id of 10

db.products.find({ id: "10" });

// 7. Find only the product name and product material

db.products.findOne({}, { _id: 0, product_name: 1, product_material: 1 });

// 8. Find all products which contain the value of soft in product material

db.products.find({ product_material: /.*soft.*/gi });

// 9. Find products which contain product color indigo  and product price 492.00

db.products.find({
  $and: [{ product_color: /.*indigo.*/gi }, { product_price: 492 }],
});

// 10. Delete the products which product price value are same

// db.products.aggregate([
// {
//     $group: { "_id": "$product_price", "doc" : {"$first": "$$ROOT"}}
// },
// {
//     $replaceRoot: { "newRoot": "$doc"}
// }
// ],
// {allowDiskUse:true})

var duplicates = [];

db.products
  .aggregate(
    [
      {
        $group: {
          _id: "$product_price", // can be grouped on multiple properties
          dups: { $addToSet: "$_id" },
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          count: { $gte: 1 }, // Duplicates considered as count greater than one
        },
      },
    ],
    { allowDiskUse: true } // For faster processing if set is larger
  )
  .forEach(function (doc) {
    doc.dups.shift();
    doc.dups.forEach(function (dupId) {
      duplicates.push(dupId);
    });
  });

// printjson(duplicates)

db.products.remove({ _id: { $in: duplicates } });