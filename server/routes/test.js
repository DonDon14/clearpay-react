const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({ message: "Tests route working!" });
});

module.exports = router;
