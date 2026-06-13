exports.getBooks = async (req, res) => {
  const { category } = req.query;

  // Pagination params
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const offset = (page - 1) * limit;

  try {
    let baseQuery = `
      FROM books b
      JOIN sections s ON b.section_id = s.id
      JOIN categories c ON b.category_id = c.id
    `;

    let whereClause = "";
    const params = [];

    if (category) {
      whereClause = " WHERE c.name = ?";
      params.push(category);
    }

    // 1. Get paginated data
    const [rows] = await db.query(
      `
      SELECT b.*, s.name AS section_name, c.name AS category_name
      ${baseQuery}
      ${whereClause}
      LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );

    // 2. Get total count (for pagination UI)
    const [[{ total }]] = await db.query(
      `
      SELECT COUNT(*) as total
      ${baseQuery}
      ${whereClause}
      `,
      params
    );

    res.json({
      data: rows,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalRecords: total
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};