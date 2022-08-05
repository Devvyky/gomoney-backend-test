import { Fixture } from '../../fixtures/interfaces';
import { Team, TeamStatues } from '../../team/interfaces';
import TeamModel from '../../team/models/teamModel';

export const searchTeam = async (
  emailOrNameContains: string
): Promise<{ teams: Team[]; fixtures: Fixture[] }> => {
  const $and: any = [{ status: TeamStatues.Active, isDeleted: false }];

  const $or = [
    { name: { $regex: emailOrNameContains, $options: 'i' } },
    { email: { $regex: emailOrNameContains, $options: 'i' } },
    { shortName: { $regex: emailOrNameContains, $options: 'i' } },
  ];
  $and.push({ $or });

  const criteria = { $and };
  const teams = await TeamModel.find(criteria);

  const pipeline = [
    {
      $match: {
        $and,
      },
    },

    {
      $group: {
        _id: null,
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
                  { $in: ['$home', '$$teamIds'] },
                  { $in: ['$away', '$$teamIds'] },
                ],
              },
            },
          },
          {
            $lookup: {
              from: 'teams',
              localField: 'home',
              foreignField: '_id',
              as: 'home',
            },
          },
          {
            $lookup: {
              from: 'teams',
              localField: 'away',
              foreignField: '_id',
              as: 'away',
            },
          },

          {
            $unwind: {
              path: '$home',
            },
          },
          {
            $unwind: {
              path: '$away',
            },
          },
        ],
        as: 'teamfixtures',
      },
    },

    {
      $unwind: {
        path: '$teamfixtures',
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $group: {
        _id: null,
        fixtures: { $push: '$teamfixtures' },
      },
    },

    {
      $project: {
        _id: 0,
        fixtures: 1,
      },
    },
  ];

  const result = await TeamModel.aggregate(pipeline);

  return { teams, fixtures: result[0].fixtures as Fixture[] };
};
