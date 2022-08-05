const criteria = [
  {
    $match: {
      $and,
    },
  },

  // {
  //   $project: {
  //     teams: {
  //       name: 1,
  //       shortName: 1,
  //       email: 1,
  //       status: 1,
  //     },
  //   },
  // },

  {
    $group: {
      _id: 1,
      teamIds: { $push: '$_id' },
    },
  },

  {
    $lookup: {
      from: 'fixtures',
      let: { teamIds: '$teamIds' },
      pipeline: [
        {
          $match: {
            $expr: {
              $or: [
                { $in: ['$home.team', '$$teamIds'] },
                { $in: ['$away.team', '$$teamIds'] },
              ],
            },
          },
        },
      ],
      as: 'fixtures',
    },
  },

  {
    $unwind: {
      path: '$fixtures',
      preserveNullAndEmptyArrays: true,
    },
  },

  {
    $project: {
      teams: '$_id',
      fixtures: '$fixtures',
    },
  },
];
