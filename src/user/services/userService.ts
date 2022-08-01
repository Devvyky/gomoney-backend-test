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

  console.log($and);

  const criteria = [
    {
      $match: {
        $and,
      },
    },
  ];

  console.log(criteria);

  const teams = await TeamModel.aggregate(criteria);

  return teams;
};
