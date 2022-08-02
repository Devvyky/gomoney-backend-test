import { Team, TeamStatues } from '../../team/interfaces';
import TeamModel from '../../team/models/teamModel';

export const searchTeam = async (emailOrNameContains: string): Promise<any> => {
  const $and: any = [{ status: TeamStatues.Active }];

  const $or = [
    { name: { $regex: emailOrNameContains, $options: 'i' } },
    { email: { $regex: emailOrNameContains, $options: 'i' } },
    { shortName: { $regex: emailOrNameContains, $options: 'i' } },
  ];
  $and.push({ $or });

  const criteria = [
    {
      $match: {
        $and,
      },
    },

    {
      $project: {
        teams: {
          name: 1,
          shortName: 1,
          email: 1,
          status: 1,
        },
      },
    },

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

    // {
    //   $project: {
    //     teams: '$_id',
    //     fixtures: '$fixtures',
    //   },
    // },
  ];

  const teams = await TeamModel.aggregate(criteria);

  return teams;
};
