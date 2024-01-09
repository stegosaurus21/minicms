import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','username','password','force_reset_password','admin']);

export const SubmissionScalarFieldEnumSchema = z.enum(['token','owner_id','src','contest_id','challenge_id','score','time']);

export const ResultScalarFieldEnumSchema = z.enum(['submission_token','challenge_id','task_number','test_number','token','time','memory','status','compile_output']);

export const ParticipantScalarFieldEnumSchema = z.enum(['user_id','contest_id','time']);

export const ContestScalarFieldEnumSchema = z.enum(['id','title','start_time','end_time','description']);

export const ContestChallengeScalarFieldEnumSchema = z.enum(['challenge_id','contest_id','max_score']);

export const ChallengeScalarFieldEnumSchema = z.enum(['id','title','type','description','input_format','output_format','time_limit','memory_limit']);

export const TaskScalarFieldEnumSchema = z.enum(['challenge_id','type','task_number','weight']);

export const TestScalarFieldEnumSchema = z.enum(['test_number','is_example','challenge_id','task_number','comment','explanation','input','output']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const NullsOrderSchema = z.enum(['first','last']);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.number().int(),
  username: z.string(),
  password: z.string(),
  force_reset_password: z.boolean(),
  admin: z.boolean(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// SUBMISSION SCHEMA
/////////////////////////////////////////

export const SubmissionSchema = z.object({
  token: z.string(),
  owner_id: z.number().int(),
  src: z.string(),
  contest_id: z.string(),
  challenge_id: z.string(),
  score: z.number().int().nullable(),
  time: z.coerce.date(),
})

export type Submission = z.infer<typeof SubmissionSchema>

/////////////////////////////////////////
// RESULT SCHEMA
/////////////////////////////////////////

export const ResultSchema = z.object({
  submission_token: z.string(),
  challenge_id: z.string(),
  task_number: z.number().int(),
  test_number: z.number().int(),
  token: z.string(),
  time: z.number(),
  memory: z.number().int(),
  status: z.string(),
  compile_output: z.string(),
})

export type Result = z.infer<typeof ResultSchema>

/////////////////////////////////////////
// PARTICIPANT SCHEMA
/////////////////////////////////////////

export const ParticipantSchema = z.object({
  user_id: z.number().int(),
  contest_id: z.string(),
  time: z.coerce.date(),
})

export type Participant = z.infer<typeof ParticipantSchema>

/////////////////////////////////////////
// CONTEST SCHEMA
/////////////////////////////////////////

export const ContestSchema = z.object({
  id: z.string(),
  title: z.string(),
  start_time: z.coerce.date().nullable(),
  end_time: z.coerce.date().nullable(),
  description: z.string(),
})

export type Contest = z.infer<typeof ContestSchema>

/////////////////////////////////////////
// CONTEST CHALLENGE SCHEMA
/////////////////////////////////////////

export const ContestChallengeSchema = z.object({
  challenge_id: z.string(),
  contest_id: z.string(),
  max_score: z.number().int(),
})

export type ContestChallenge = z.infer<typeof ContestChallengeSchema>

/////////////////////////////////////////
// CHALLENGE SCHEMA
/////////////////////////////////////////

export const ChallengeSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: z.string(),
  description: z.string(),
  input_format: z.string(),
  output_format: z.string(),
  time_limit: z.number().int(),
  memory_limit: z.number().int(),
})

export type Challenge = z.infer<typeof ChallengeSchema>

/////////////////////////////////////////
// TASK SCHEMA
/////////////////////////////////////////

export const TaskSchema = z.object({
  challenge_id: z.string(),
  type: z.string(),
  task_number: z.number().int(),
  weight: z.number().int(),
})

export type Task = z.infer<typeof TaskSchema>

/////////////////////////////////////////
// TEST SCHEMA
/////////////////////////////////////////

export const TestSchema = z.object({
  test_number: z.number().int(),
  is_example: z.boolean(),
  challenge_id: z.string(),
  task_number: z.number().int(),
  comment: z.string(),
  explanation: z.string(),
  input: z.string(),
  output: z.string(),
})

export type Test = z.infer<typeof TestSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  submissions: z.union([z.boolean(),z.lazy(() => SubmissionFindManyArgsSchema)]).optional(),
  participants: z.union([z.boolean(),z.lazy(() => ParticipantFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  submissions: z.boolean().optional(),
  participants: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  username: z.boolean().optional(),
  password: z.boolean().optional(),
  force_reset_password: z.boolean().optional(),
  admin: z.boolean().optional(),
  submissions: z.union([z.boolean(),z.lazy(() => SubmissionFindManyArgsSchema)]).optional(),
  participants: z.union([z.boolean(),z.lazy(() => ParticipantFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// SUBMISSION
//------------------------------------------------------

export const SubmissionIncludeSchema: z.ZodType<Prisma.SubmissionInclude> = z.object({
  owner: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  challenge: z.union([z.boolean(),z.lazy(() => ContestChallengeArgsSchema)]).optional(),
  results: z.union([z.boolean(),z.lazy(() => ResultFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => SubmissionCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const SubmissionArgsSchema: z.ZodType<Prisma.SubmissionDefaultArgs> = z.object({
  select: z.lazy(() => SubmissionSelectSchema).optional(),
  include: z.lazy(() => SubmissionIncludeSchema).optional(),
}).strict();

export const SubmissionCountOutputTypeArgsSchema: z.ZodType<Prisma.SubmissionCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => SubmissionCountOutputTypeSelectSchema).nullish(),
}).strict();

export const SubmissionCountOutputTypeSelectSchema: z.ZodType<Prisma.SubmissionCountOutputTypeSelect> = z.object({
  results: z.boolean().optional(),
}).strict();

export const SubmissionSelectSchema: z.ZodType<Prisma.SubmissionSelect> = z.object({
  token: z.boolean().optional(),
  owner_id: z.boolean().optional(),
  src: z.boolean().optional(),
  contest_id: z.boolean().optional(),
  challenge_id: z.boolean().optional(),
  score: z.boolean().optional(),
  time: z.boolean().optional(),
  owner: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  challenge: z.union([z.boolean(),z.lazy(() => ContestChallengeArgsSchema)]).optional(),
  results: z.union([z.boolean(),z.lazy(() => ResultFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => SubmissionCountOutputTypeArgsSchema)]).optional(),
}).strict()

// RESULT
//------------------------------------------------------

export const ResultIncludeSchema: z.ZodType<Prisma.ResultInclude> = z.object({
  submission: z.union([z.boolean(),z.lazy(() => SubmissionArgsSchema)]).optional(),
  task: z.union([z.boolean(),z.lazy(() => TaskArgsSchema)]).optional(),
  test: z.union([z.boolean(),z.lazy(() => TestArgsSchema)]).optional(),
}).strict()

export const ResultArgsSchema: z.ZodType<Prisma.ResultDefaultArgs> = z.object({
  select: z.lazy(() => ResultSelectSchema).optional(),
  include: z.lazy(() => ResultIncludeSchema).optional(),
}).strict();

export const ResultSelectSchema: z.ZodType<Prisma.ResultSelect> = z.object({
  submission_token: z.boolean().optional(),
  challenge_id: z.boolean().optional(),
  task_number: z.boolean().optional(),
  test_number: z.boolean().optional(),
  token: z.boolean().optional(),
  time: z.boolean().optional(),
  memory: z.boolean().optional(),
  status: z.boolean().optional(),
  compile_output: z.boolean().optional(),
  submission: z.union([z.boolean(),z.lazy(() => SubmissionArgsSchema)]).optional(),
  task: z.union([z.boolean(),z.lazy(() => TaskArgsSchema)]).optional(),
  test: z.union([z.boolean(),z.lazy(() => TestArgsSchema)]).optional(),
}).strict()

// PARTICIPANT
//------------------------------------------------------

export const ParticipantIncludeSchema: z.ZodType<Prisma.ParticipantInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  contest: z.union([z.boolean(),z.lazy(() => ContestArgsSchema)]).optional(),
}).strict()

export const ParticipantArgsSchema: z.ZodType<Prisma.ParticipantDefaultArgs> = z.object({
  select: z.lazy(() => ParticipantSelectSchema).optional(),
  include: z.lazy(() => ParticipantIncludeSchema).optional(),
}).strict();

export const ParticipantSelectSchema: z.ZodType<Prisma.ParticipantSelect> = z.object({
  user_id: z.boolean().optional(),
  contest_id: z.boolean().optional(),
  time: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  contest: z.union([z.boolean(),z.lazy(() => ContestArgsSchema)]).optional(),
}).strict()

// CONTEST
//------------------------------------------------------

export const ContestIncludeSchema: z.ZodType<Prisma.ContestInclude> = z.object({
  challenges: z.union([z.boolean(),z.lazy(() => ContestChallengeFindManyArgsSchema)]).optional(),
  participants: z.union([z.boolean(),z.lazy(() => ParticipantFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ContestCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ContestArgsSchema: z.ZodType<Prisma.ContestDefaultArgs> = z.object({
  select: z.lazy(() => ContestSelectSchema).optional(),
  include: z.lazy(() => ContestIncludeSchema).optional(),
}).strict();

export const ContestCountOutputTypeArgsSchema: z.ZodType<Prisma.ContestCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ContestCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ContestCountOutputTypeSelectSchema: z.ZodType<Prisma.ContestCountOutputTypeSelect> = z.object({
  challenges: z.boolean().optional(),
  participants: z.boolean().optional(),
}).strict();

export const ContestSelectSchema: z.ZodType<Prisma.ContestSelect> = z.object({
  id: z.boolean().optional(),
  title: z.boolean().optional(),
  start_time: z.boolean().optional(),
  end_time: z.boolean().optional(),
  description: z.boolean().optional(),
  challenges: z.union([z.boolean(),z.lazy(() => ContestChallengeFindManyArgsSchema)]).optional(),
  participants: z.union([z.boolean(),z.lazy(() => ParticipantFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ContestCountOutputTypeArgsSchema)]).optional(),
}).strict()

// CONTEST CHALLENGE
//------------------------------------------------------

export const ContestChallengeIncludeSchema: z.ZodType<Prisma.ContestChallengeInclude> = z.object({
  challenge: z.union([z.boolean(),z.lazy(() => ChallengeArgsSchema)]).optional(),
  contest: z.union([z.boolean(),z.lazy(() => ContestArgsSchema)]).optional(),
  submissions: z.union([z.boolean(),z.lazy(() => SubmissionFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ContestChallengeCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ContestChallengeArgsSchema: z.ZodType<Prisma.ContestChallengeDefaultArgs> = z.object({
  select: z.lazy(() => ContestChallengeSelectSchema).optional(),
  include: z.lazy(() => ContestChallengeIncludeSchema).optional(),
}).strict();

export const ContestChallengeCountOutputTypeArgsSchema: z.ZodType<Prisma.ContestChallengeCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ContestChallengeCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ContestChallengeCountOutputTypeSelectSchema: z.ZodType<Prisma.ContestChallengeCountOutputTypeSelect> = z.object({
  submissions: z.boolean().optional(),
}).strict();

export const ContestChallengeSelectSchema: z.ZodType<Prisma.ContestChallengeSelect> = z.object({
  challenge_id: z.boolean().optional(),
  contest_id: z.boolean().optional(),
  max_score: z.boolean().optional(),
  challenge: z.union([z.boolean(),z.lazy(() => ChallengeArgsSchema)]).optional(),
  contest: z.union([z.boolean(),z.lazy(() => ContestArgsSchema)]).optional(),
  submissions: z.union([z.boolean(),z.lazy(() => SubmissionFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ContestChallengeCountOutputTypeArgsSchema)]).optional(),
}).strict()

// CHALLENGE
//------------------------------------------------------

export const ChallengeIncludeSchema: z.ZodType<Prisma.ChallengeInclude> = z.object({
  tasks: z.union([z.boolean(),z.lazy(() => TaskFindManyArgsSchema)]).optional(),
  contests: z.union([z.boolean(),z.lazy(() => ContestChallengeFindManyArgsSchema)]).optional(),
  tests: z.union([z.boolean(),z.lazy(() => TestFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ChallengeCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ChallengeArgsSchema: z.ZodType<Prisma.ChallengeDefaultArgs> = z.object({
  select: z.lazy(() => ChallengeSelectSchema).optional(),
  include: z.lazy(() => ChallengeIncludeSchema).optional(),
}).strict();

export const ChallengeCountOutputTypeArgsSchema: z.ZodType<Prisma.ChallengeCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ChallengeCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ChallengeCountOutputTypeSelectSchema: z.ZodType<Prisma.ChallengeCountOutputTypeSelect> = z.object({
  tasks: z.boolean().optional(),
  contests: z.boolean().optional(),
  tests: z.boolean().optional(),
}).strict();

export const ChallengeSelectSchema: z.ZodType<Prisma.ChallengeSelect> = z.object({
  id: z.boolean().optional(),
  title: z.boolean().optional(),
  type: z.boolean().optional(),
  description: z.boolean().optional(),
  input_format: z.boolean().optional(),
  output_format: z.boolean().optional(),
  time_limit: z.boolean().optional(),
  memory_limit: z.boolean().optional(),
  tasks: z.union([z.boolean(),z.lazy(() => TaskFindManyArgsSchema)]).optional(),
  contests: z.union([z.boolean(),z.lazy(() => ContestChallengeFindManyArgsSchema)]).optional(),
  tests: z.union([z.boolean(),z.lazy(() => TestFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ChallengeCountOutputTypeArgsSchema)]).optional(),
}).strict()

// TASK
//------------------------------------------------------

export const TaskIncludeSchema: z.ZodType<Prisma.TaskInclude> = z.object({
  challenge: z.union([z.boolean(),z.lazy(() => ChallengeArgsSchema)]).optional(),
  tests: z.union([z.boolean(),z.lazy(() => TestFindManyArgsSchema)]).optional(),
  Result: z.union([z.boolean(),z.lazy(() => ResultFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TaskCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const TaskArgsSchema: z.ZodType<Prisma.TaskDefaultArgs> = z.object({
  select: z.lazy(() => TaskSelectSchema).optional(),
  include: z.lazy(() => TaskIncludeSchema).optional(),
}).strict();

export const TaskCountOutputTypeArgsSchema: z.ZodType<Prisma.TaskCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => TaskCountOutputTypeSelectSchema).nullish(),
}).strict();

export const TaskCountOutputTypeSelectSchema: z.ZodType<Prisma.TaskCountOutputTypeSelect> = z.object({
  tests: z.boolean().optional(),
  Result: z.boolean().optional(),
}).strict();

export const TaskSelectSchema: z.ZodType<Prisma.TaskSelect> = z.object({
  challenge_id: z.boolean().optional(),
  type: z.boolean().optional(),
  task_number: z.boolean().optional(),
  weight: z.boolean().optional(),
  challenge: z.union([z.boolean(),z.lazy(() => ChallengeArgsSchema)]).optional(),
  tests: z.union([z.boolean(),z.lazy(() => TestFindManyArgsSchema)]).optional(),
  Result: z.union([z.boolean(),z.lazy(() => ResultFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TaskCountOutputTypeArgsSchema)]).optional(),
}).strict()

// TEST
//------------------------------------------------------

export const TestIncludeSchema: z.ZodType<Prisma.TestInclude> = z.object({
  task: z.union([z.boolean(),z.lazy(() => TaskArgsSchema)]).optional(),
  challenge: z.union([z.boolean(),z.lazy(() => ChallengeArgsSchema)]).optional(),
  Result: z.union([z.boolean(),z.lazy(() => ResultFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TestCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const TestArgsSchema: z.ZodType<Prisma.TestDefaultArgs> = z.object({
  select: z.lazy(() => TestSelectSchema).optional(),
  include: z.lazy(() => TestIncludeSchema).optional(),
}).strict();

export const TestCountOutputTypeArgsSchema: z.ZodType<Prisma.TestCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => TestCountOutputTypeSelectSchema).nullish(),
}).strict();

export const TestCountOutputTypeSelectSchema: z.ZodType<Prisma.TestCountOutputTypeSelect> = z.object({
  Result: z.boolean().optional(),
}).strict();

export const TestSelectSchema: z.ZodType<Prisma.TestSelect> = z.object({
  test_number: z.boolean().optional(),
  is_example: z.boolean().optional(),
  challenge_id: z.boolean().optional(),
  task_number: z.boolean().optional(),
  comment: z.boolean().optional(),
  explanation: z.boolean().optional(),
  input: z.boolean().optional(),
  output: z.boolean().optional(),
  task: z.union([z.boolean(),z.lazy(() => TaskArgsSchema)]).optional(),
  challenge: z.union([z.boolean(),z.lazy(() => ChallengeArgsSchema)]).optional(),
  Result: z.union([z.boolean(),z.lazy(() => ResultFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TestCountOutputTypeArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  username: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  force_reset_password: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  admin: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  submissions: z.lazy(() => SubmissionListRelationFilterSchema).optional(),
  participants: z.lazy(() => ParticipantListRelationFilterSchema).optional()
}).strict() as z.ZodType<Prisma.UserWhereInput>;

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  force_reset_password: z.lazy(() => SortOrderSchema).optional(),
  admin: z.lazy(() => SortOrderSchema).optional(),
  submissions: z.lazy(() => SubmissionOrderByRelationAggregateInputSchema).optional(),
  participants: z.lazy(() => ParticipantOrderByRelationAggregateInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserOrderByWithRelationInput>;

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    username: z.string()
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    username: z.string(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  username: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  password: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  force_reset_password: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  admin: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  submissions: z.lazy(() => SubmissionListRelationFilterSchema).optional(),
  participants: z.lazy(() => ParticipantListRelationFilterSchema).optional()
}).strict()) as z.ZodType<Prisma.UserWhereUniqueInput>;

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  force_reset_password: z.lazy(() => SortOrderSchema).optional(),
  admin: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => UserAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => UserSumOrderByAggregateInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserOrderByWithAggregationInput>;

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  username: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  force_reset_password: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  admin: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
}).strict() as z.ZodType<Prisma.UserScalarWhereWithAggregatesInput>;

export const SubmissionWhereInputSchema: z.ZodType<Prisma.SubmissionWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SubmissionWhereInputSchema),z.lazy(() => SubmissionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SubmissionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SubmissionWhereInputSchema),z.lazy(() => SubmissionWhereInputSchema).array() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  owner_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  src: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  contest_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  challenge_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  score: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  time: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  owner: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  challenge: z.union([ z.lazy(() => ContestChallengeRelationFilterSchema),z.lazy(() => ContestChallengeWhereInputSchema) ]).optional(),
  results: z.lazy(() => ResultListRelationFilterSchema).optional()
}).strict() as z.ZodType<Prisma.SubmissionWhereInput>;

export const SubmissionOrderByWithRelationInputSchema: z.ZodType<Prisma.SubmissionOrderByWithRelationInput> = z.object({
  token: z.lazy(() => SortOrderSchema).optional(),
  owner_id: z.lazy(() => SortOrderSchema).optional(),
  src: z.lazy(() => SortOrderSchema).optional(),
  contest_id: z.lazy(() => SortOrderSchema).optional(),
  challenge_id: z.lazy(() => SortOrderSchema).optional(),
  score: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  time: z.lazy(() => SortOrderSchema).optional(),
  owner: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  challenge: z.lazy(() => ContestChallengeOrderByWithRelationInputSchema).optional(),
  results: z.lazy(() => ResultOrderByRelationAggregateInputSchema).optional()
}).strict() as z.ZodType<Prisma.SubmissionOrderByWithRelationInput>;

export const SubmissionWhereUniqueInputSchema: z.ZodType<Prisma.SubmissionWhereUniqueInput> = z.object({
  token: z.string()
})
.and(z.object({
  token: z.string().optional(),
  AND: z.union([ z.lazy(() => SubmissionWhereInputSchema),z.lazy(() => SubmissionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SubmissionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SubmissionWhereInputSchema),z.lazy(() => SubmissionWhereInputSchema).array() ]).optional(),
  owner_id: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  src: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  contest_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  challenge_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  score: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  time: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  owner: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  challenge: z.union([ z.lazy(() => ContestChallengeRelationFilterSchema),z.lazy(() => ContestChallengeWhereInputSchema) ]).optional(),
  results: z.lazy(() => ResultListRelationFilterSchema).optional()
}).strict()) as z.ZodType<Prisma.SubmissionWhereUniqueInput>;

export const SubmissionOrderByWithAggregationInputSchema: z.ZodType<Prisma.SubmissionOrderByWithAggregationInput> = z.object({
  token: z.lazy(() => SortOrderSchema).optional(),
  owner_id: z.lazy(() => SortOrderSchema).optional(),
  src: z.lazy(() => SortOrderSchema).optional(),
  contest_id: z.lazy(() => SortOrderSchema).optional(),
  challenge_id: z.lazy(() => SortOrderSchema).optional(),
  score: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  time: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => SubmissionCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => SubmissionAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => SubmissionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => SubmissionMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => SubmissionSumOrderByAggregateInputSchema).optional()
}).strict() as z.ZodType<Prisma.SubmissionOrderByWithAggregationInput>;

export const SubmissionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.SubmissionScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => SubmissionScalarWhereWithAggregatesInputSchema),z.lazy(() => SubmissionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => SubmissionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SubmissionScalarWhereWithAggregatesInputSchema),z.lazy(() => SubmissionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  token: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  owner_id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  src: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  contest_id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  challenge_id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  score: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  time: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict() as z.ZodType<Prisma.SubmissionScalarWhereWithAggregatesInput>;

export const ResultWhereInputSchema: z.ZodType<Prisma.ResultWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ResultWhereInputSchema),z.lazy(() => ResultWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ResultWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ResultWhereInputSchema),z.lazy(() => ResultWhereInputSchema).array() ]).optional(),
  submission_token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  challenge_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  task_number: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  test_number: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  time: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  memory: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  compile_output: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  submission: z.union([ z.lazy(() => SubmissionRelationFilterSchema),z.lazy(() => SubmissionWhereInputSchema) ]).optional(),
  task: z.union([ z.lazy(() => TaskRelationFilterSchema),z.lazy(() => TaskWhereInputSchema) ]).optional(),
  test: z.union([ z.lazy(() => TestRelationFilterSchema),z.lazy(() => TestWhereInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ResultWhereInput>;

export const ResultOrderByWithRelationInputSchema: z.ZodType<Prisma.ResultOrderByWithRelationInput> = z.object({
  submission_token: z.lazy(() => SortOrderSchema).optional(),
  challenge_id: z.lazy(() => SortOrderSchema).optional(),
  task_number: z.lazy(() => SortOrderSchema).optional(),
  test_number: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional(),
  memory: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  compile_output: z.lazy(() => SortOrderSchema).optional(),
  submission: z.lazy(() => SubmissionOrderByWithRelationInputSchema).optional(),
  task: z.lazy(() => TaskOrderByWithRelationInputSchema).optional(),
  test: z.lazy(() => TestOrderByWithRelationInputSchema).optional()
}).strict() as z.ZodType<Prisma.ResultOrderByWithRelationInput>;

export const ResultWhereUniqueInputSchema: z.ZodType<Prisma.ResultWhereUniqueInput> = z.object({
  submission_token_task_number_test_number: z.lazy(() => ResultSubmission_tokenTask_numberTest_numberCompoundUniqueInputSchema)
})
.and(z.object({
  submission_token_task_number_test_number: z.lazy(() => ResultSubmission_tokenTask_numberTest_numberCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => ResultWhereInputSchema),z.lazy(() => ResultWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ResultWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ResultWhereInputSchema),z.lazy(() => ResultWhereInputSchema).array() ]).optional(),
  submission_token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  challenge_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  task_number: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  test_number: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  time: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  memory: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  compile_output: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  submission: z.union([ z.lazy(() => SubmissionRelationFilterSchema),z.lazy(() => SubmissionWhereInputSchema) ]).optional(),
  task: z.union([ z.lazy(() => TaskRelationFilterSchema),z.lazy(() => TaskWhereInputSchema) ]).optional(),
  test: z.union([ z.lazy(() => TestRelationFilterSchema),z.lazy(() => TestWhereInputSchema) ]).optional(),
}).strict()) as z.ZodType<Prisma.ResultWhereUniqueInput>;

export const ResultOrderByWithAggregationInputSchema: z.ZodType<Prisma.ResultOrderByWithAggregationInput> = z.object({
  submission_token: z.lazy(() => SortOrderSchema).optional(),
  challenge_id: z.lazy(() => SortOrderSchema).optional(),
  task_number: z.lazy(() => SortOrderSchema).optional(),
  test_number: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional(),
  memory: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  compile_output: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ResultCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ResultAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ResultMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ResultMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ResultSumOrderByAggregateInputSchema).optional()
}).strict() as z.ZodType<Prisma.ResultOrderByWithAggregationInput>;

export const ResultScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ResultScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ResultScalarWhereWithAggregatesInputSchema),z.lazy(() => ResultScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ResultScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ResultScalarWhereWithAggregatesInputSchema),z.lazy(() => ResultScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  submission_token: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  challenge_id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  task_number: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  test_number: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  token: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  time: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  memory: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  status: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  compile_output: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict() as z.ZodType<Prisma.ResultScalarWhereWithAggregatesInput>;

export const ParticipantWhereInputSchema: z.ZodType<Prisma.ParticipantWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ParticipantWhereInputSchema),z.lazy(() => ParticipantWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ParticipantWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ParticipantWhereInputSchema),z.lazy(() => ParticipantWhereInputSchema).array() ]).optional(),
  user_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  contest_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  time: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  contest: z.union([ z.lazy(() => ContestRelationFilterSchema),z.lazy(() => ContestWhereInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ParticipantWhereInput>;

export const ParticipantOrderByWithRelationInputSchema: z.ZodType<Prisma.ParticipantOrderByWithRelationInput> = z.object({
  user_id: z.lazy(() => SortOrderSchema).optional(),
  contest_id: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  contest: z.lazy(() => ContestOrderByWithRelationInputSchema).optional()
}).strict() as z.ZodType<Prisma.ParticipantOrderByWithRelationInput>;

export const ParticipantWhereUniqueInputSchema: z.ZodType<Prisma.ParticipantWhereUniqueInput> = z.object({
  user_id_contest_id: z.lazy(() => ParticipantUser_idContest_idCompoundUniqueInputSchema)
})
.and(z.object({
  user_id_contest_id: z.lazy(() => ParticipantUser_idContest_idCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => ParticipantWhereInputSchema),z.lazy(() => ParticipantWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ParticipantWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ParticipantWhereInputSchema),z.lazy(() => ParticipantWhereInputSchema).array() ]).optional(),
  user_id: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  contest_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  time: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  contest: z.union([ z.lazy(() => ContestRelationFilterSchema),z.lazy(() => ContestWhereInputSchema) ]).optional(),
}).strict()) as z.ZodType<Prisma.ParticipantWhereUniqueInput>;

export const ParticipantOrderByWithAggregationInputSchema: z.ZodType<Prisma.ParticipantOrderByWithAggregationInput> = z.object({
  user_id: z.lazy(() => SortOrderSchema).optional(),
  contest_id: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ParticipantCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ParticipantAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ParticipantMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ParticipantMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ParticipantSumOrderByAggregateInputSchema).optional()
}).strict() as z.ZodType<Prisma.ParticipantOrderByWithAggregationInput>;

export const ParticipantScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ParticipantScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ParticipantScalarWhereWithAggregatesInputSchema),z.lazy(() => ParticipantScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ParticipantScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ParticipantScalarWhereWithAggregatesInputSchema),z.lazy(() => ParticipantScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  user_id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  contest_id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  time: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict() as z.ZodType<Prisma.ParticipantScalarWhereWithAggregatesInput>;

export const ContestWhereInputSchema: z.ZodType<Prisma.ContestWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ContestWhereInputSchema),z.lazy(() => ContestWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContestWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContestWhereInputSchema),z.lazy(() => ContestWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  start_time: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  end_time: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  challenges: z.lazy(() => ContestChallengeListRelationFilterSchema).optional(),
  participants: z.lazy(() => ParticipantListRelationFilterSchema).optional()
}).strict() as z.ZodType<Prisma.ContestWhereInput>;

export const ContestOrderByWithRelationInputSchema: z.ZodType<Prisma.ContestOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  start_time: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  end_time: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  challenges: z.lazy(() => ContestChallengeOrderByRelationAggregateInputSchema).optional(),
  participants: z.lazy(() => ParticipantOrderByRelationAggregateInputSchema).optional()
}).strict() as z.ZodType<Prisma.ContestOrderByWithRelationInput>;

export const ContestWhereUniqueInputSchema: z.ZodType<Prisma.ContestWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => ContestWhereInputSchema),z.lazy(() => ContestWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContestWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContestWhereInputSchema),z.lazy(() => ContestWhereInputSchema).array() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  start_time: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  end_time: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  challenges: z.lazy(() => ContestChallengeListRelationFilterSchema).optional(),
  participants: z.lazy(() => ParticipantListRelationFilterSchema).optional()
}).strict()) as z.ZodType<Prisma.ContestWhereUniqueInput>;

export const ContestOrderByWithAggregationInputSchema: z.ZodType<Prisma.ContestOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  start_time: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  end_time: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ContestCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ContestMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ContestMinOrderByAggregateInputSchema).optional()
}).strict() as z.ZodType<Prisma.ContestOrderByWithAggregationInput>;

export const ContestScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ContestScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ContestScalarWhereWithAggregatesInputSchema),z.lazy(() => ContestScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContestScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContestScalarWhereWithAggregatesInputSchema),z.lazy(() => ContestScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  start_time: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  end_time: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict() as z.ZodType<Prisma.ContestScalarWhereWithAggregatesInput>;

export const ContestChallengeWhereInputSchema: z.ZodType<Prisma.ContestChallengeWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ContestChallengeWhereInputSchema),z.lazy(() => ContestChallengeWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContestChallengeWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContestChallengeWhereInputSchema),z.lazy(() => ContestChallengeWhereInputSchema).array() ]).optional(),
  challenge_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  contest_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  max_score: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  challenge: z.union([ z.lazy(() => ChallengeRelationFilterSchema),z.lazy(() => ChallengeWhereInputSchema) ]).optional(),
  contest: z.union([ z.lazy(() => ContestRelationFilterSchema),z.lazy(() => ContestWhereInputSchema) ]).optional(),
  submissions: z.lazy(() => SubmissionListRelationFilterSchema).optional()
}).strict() as z.ZodType<Prisma.ContestChallengeWhereInput>;

export const ContestChallengeOrderByWithRelationInputSchema: z.ZodType<Prisma.ContestChallengeOrderByWithRelationInput> = z.object({
  challenge_id: z.lazy(() => SortOrderSchema).optional(),
  contest_id: z.lazy(() => SortOrderSchema).optional(),
  max_score: z.lazy(() => SortOrderSchema).optional(),
  challenge: z.lazy(() => ChallengeOrderByWithRelationInputSchema).optional(),
  contest: z.lazy(() => ContestOrderByWithRelationInputSchema).optional(),
  submissions: z.lazy(() => SubmissionOrderByRelationAggregateInputSchema).optional()
}).strict() as z.ZodType<Prisma.ContestChallengeOrderByWithRelationInput>;

export const ContestChallengeWhereUniqueInputSchema: z.ZodType<Prisma.ContestChallengeWhereUniqueInput> = z.object({
  challenge_id_contest_id: z.lazy(() => ContestChallengeChallenge_idContest_idCompoundUniqueInputSchema)
})
.and(z.object({
  challenge_id_contest_id: z.lazy(() => ContestChallengeChallenge_idContest_idCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => ContestChallengeWhereInputSchema),z.lazy(() => ContestChallengeWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContestChallengeWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContestChallengeWhereInputSchema),z.lazy(() => ContestChallengeWhereInputSchema).array() ]).optional(),
  challenge_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  contest_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  max_score: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  challenge: z.union([ z.lazy(() => ChallengeRelationFilterSchema),z.lazy(() => ChallengeWhereInputSchema) ]).optional(),
  contest: z.union([ z.lazy(() => ContestRelationFilterSchema),z.lazy(() => ContestWhereInputSchema) ]).optional(),
  submissions: z.lazy(() => SubmissionListRelationFilterSchema).optional()
}).strict()) as z.ZodType<Prisma.ContestChallengeWhereUniqueInput>;

export const ContestChallengeOrderByWithAggregationInputSchema: z.ZodType<Prisma.ContestChallengeOrderByWithAggregationInput> = z.object({
  challenge_id: z.lazy(() => SortOrderSchema).optional(),
  contest_id: z.lazy(() => SortOrderSchema).optional(),
  max_score: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ContestChallengeCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ContestChallengeAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ContestChallengeMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ContestChallengeMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ContestChallengeSumOrderByAggregateInputSchema).optional()
}).strict() as z.ZodType<Prisma.ContestChallengeOrderByWithAggregationInput>;

export const ContestChallengeScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ContestChallengeScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ContestChallengeScalarWhereWithAggregatesInputSchema),z.lazy(() => ContestChallengeScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContestChallengeScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContestChallengeScalarWhereWithAggregatesInputSchema),z.lazy(() => ContestChallengeScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  challenge_id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  contest_id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  max_score: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict() as z.ZodType<Prisma.ContestChallengeScalarWhereWithAggregatesInput>;

export const ChallengeWhereInputSchema: z.ZodType<Prisma.ChallengeWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ChallengeWhereInputSchema),z.lazy(() => ChallengeWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ChallengeWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ChallengeWhereInputSchema),z.lazy(() => ChallengeWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  input_format: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  output_format: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  time_limit: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  memory_limit: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  tasks: z.lazy(() => TaskListRelationFilterSchema).optional(),
  contests: z.lazy(() => ContestChallengeListRelationFilterSchema).optional(),
  tests: z.lazy(() => TestListRelationFilterSchema).optional()
}).strict() as z.ZodType<Prisma.ChallengeWhereInput>;

export const ChallengeOrderByWithRelationInputSchema: z.ZodType<Prisma.ChallengeOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  input_format: z.lazy(() => SortOrderSchema).optional(),
  output_format: z.lazy(() => SortOrderSchema).optional(),
  time_limit: z.lazy(() => SortOrderSchema).optional(),
  memory_limit: z.lazy(() => SortOrderSchema).optional(),
  tasks: z.lazy(() => TaskOrderByRelationAggregateInputSchema).optional(),
  contests: z.lazy(() => ContestChallengeOrderByRelationAggregateInputSchema).optional(),
  tests: z.lazy(() => TestOrderByRelationAggregateInputSchema).optional()
}).strict() as z.ZodType<Prisma.ChallengeOrderByWithRelationInput>;

export const ChallengeWhereUniqueInputSchema: z.ZodType<Prisma.ChallengeWhereUniqueInput> = z.object({
  id: z.string()
})
.and(z.object({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => ChallengeWhereInputSchema),z.lazy(() => ChallengeWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ChallengeWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ChallengeWhereInputSchema),z.lazy(() => ChallengeWhereInputSchema).array() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  input_format: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  output_format: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  time_limit: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  memory_limit: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  tasks: z.lazy(() => TaskListRelationFilterSchema).optional(),
  contests: z.lazy(() => ContestChallengeListRelationFilterSchema).optional(),
  tests: z.lazy(() => TestListRelationFilterSchema).optional()
}).strict()) as z.ZodType<Prisma.ChallengeWhereUniqueInput>;

export const ChallengeOrderByWithAggregationInputSchema: z.ZodType<Prisma.ChallengeOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  input_format: z.lazy(() => SortOrderSchema).optional(),
  output_format: z.lazy(() => SortOrderSchema).optional(),
  time_limit: z.lazy(() => SortOrderSchema).optional(),
  memory_limit: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ChallengeCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ChallengeAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ChallengeMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ChallengeMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ChallengeSumOrderByAggregateInputSchema).optional()
}).strict() as z.ZodType<Prisma.ChallengeOrderByWithAggregationInput>;

export const ChallengeScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ChallengeScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ChallengeScalarWhereWithAggregatesInputSchema),z.lazy(() => ChallengeScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ChallengeScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ChallengeScalarWhereWithAggregatesInputSchema),z.lazy(() => ChallengeScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  input_format: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  output_format: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  time_limit: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  memory_limit: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict() as z.ZodType<Prisma.ChallengeScalarWhereWithAggregatesInput>;

export const TaskWhereInputSchema: z.ZodType<Prisma.TaskWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TaskWhereInputSchema),z.lazy(() => TaskWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TaskWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TaskWhereInputSchema),z.lazy(() => TaskWhereInputSchema).array() ]).optional(),
  challenge_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  task_number: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  weight: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  challenge: z.union([ z.lazy(() => ChallengeRelationFilterSchema),z.lazy(() => ChallengeWhereInputSchema) ]).optional(),
  tests: z.lazy(() => TestListRelationFilterSchema).optional(),
  Result: z.lazy(() => ResultListRelationFilterSchema).optional()
}).strict() as z.ZodType<Prisma.TaskWhereInput>;

export const TaskOrderByWithRelationInputSchema: z.ZodType<Prisma.TaskOrderByWithRelationInput> = z.object({
  challenge_id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  task_number: z.lazy(() => SortOrderSchema).optional(),
  weight: z.lazy(() => SortOrderSchema).optional(),
  challenge: z.lazy(() => ChallengeOrderByWithRelationInputSchema).optional(),
  tests: z.lazy(() => TestOrderByRelationAggregateInputSchema).optional(),
  Result: z.lazy(() => ResultOrderByRelationAggregateInputSchema).optional()
}).strict() as z.ZodType<Prisma.TaskOrderByWithRelationInput>;

export const TaskWhereUniqueInputSchema: z.ZodType<Prisma.TaskWhereUniqueInput> = z.object({
  challenge_id_task_number: z.lazy(() => TaskChallenge_idTask_numberCompoundUniqueInputSchema)
})
.and(z.object({
  challenge_id_task_number: z.lazy(() => TaskChallenge_idTask_numberCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => TaskWhereInputSchema),z.lazy(() => TaskWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TaskWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TaskWhereInputSchema),z.lazy(() => TaskWhereInputSchema).array() ]).optional(),
  challenge_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  task_number: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  weight: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  challenge: z.union([ z.lazy(() => ChallengeRelationFilterSchema),z.lazy(() => ChallengeWhereInputSchema) ]).optional(),
  tests: z.lazy(() => TestListRelationFilterSchema).optional(),
  Result: z.lazy(() => ResultListRelationFilterSchema).optional()
}).strict()) as z.ZodType<Prisma.TaskWhereUniqueInput>;

export const TaskOrderByWithAggregationInputSchema: z.ZodType<Prisma.TaskOrderByWithAggregationInput> = z.object({
  challenge_id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  task_number: z.lazy(() => SortOrderSchema).optional(),
  weight: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => TaskCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => TaskAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => TaskMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => TaskMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => TaskSumOrderByAggregateInputSchema).optional()
}).strict() as z.ZodType<Prisma.TaskOrderByWithAggregationInput>;

export const TaskScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TaskScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => TaskScalarWhereWithAggregatesInputSchema),z.lazy(() => TaskScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => TaskScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TaskScalarWhereWithAggregatesInputSchema),z.lazy(() => TaskScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  challenge_id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  task_number: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  weight: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
}).strict() as z.ZodType<Prisma.TaskScalarWhereWithAggregatesInput>;

export const TestWhereInputSchema: z.ZodType<Prisma.TestWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TestWhereInputSchema),z.lazy(() => TestWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TestWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TestWhereInputSchema),z.lazy(() => TestWhereInputSchema).array() ]).optional(),
  test_number: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  is_example: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  challenge_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  task_number: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  comment: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  explanation: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  input: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  output: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  task: z.union([ z.lazy(() => TaskRelationFilterSchema),z.lazy(() => TaskWhereInputSchema) ]).optional(),
  challenge: z.union([ z.lazy(() => ChallengeRelationFilterSchema),z.lazy(() => ChallengeWhereInputSchema) ]).optional(),
  Result: z.lazy(() => ResultListRelationFilterSchema).optional()
}).strict() as z.ZodType<Prisma.TestWhereInput>;

export const TestOrderByWithRelationInputSchema: z.ZodType<Prisma.TestOrderByWithRelationInput> = z.object({
  test_number: z.lazy(() => SortOrderSchema).optional(),
  is_example: z.lazy(() => SortOrderSchema).optional(),
  challenge_id: z.lazy(() => SortOrderSchema).optional(),
  task_number: z.lazy(() => SortOrderSchema).optional(),
  comment: z.lazy(() => SortOrderSchema).optional(),
  explanation: z.lazy(() => SortOrderSchema).optional(),
  input: z.lazy(() => SortOrderSchema).optional(),
  output: z.lazy(() => SortOrderSchema).optional(),
  task: z.lazy(() => TaskOrderByWithRelationInputSchema).optional(),
  challenge: z.lazy(() => ChallengeOrderByWithRelationInputSchema).optional(),
  Result: z.lazy(() => ResultOrderByRelationAggregateInputSchema).optional()
}).strict() as z.ZodType<Prisma.TestOrderByWithRelationInput>;

export const TestWhereUniqueInputSchema: z.ZodType<Prisma.TestWhereUniqueInput> = z.object({
  challenge_id_task_number_test_number: z.lazy(() => TestChallenge_idTask_numberTest_numberCompoundUniqueInputSchema)
})
.and(z.object({
  challenge_id_task_number_test_number: z.lazy(() => TestChallenge_idTask_numberTest_numberCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => TestWhereInputSchema),z.lazy(() => TestWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TestWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TestWhereInputSchema),z.lazy(() => TestWhereInputSchema).array() ]).optional(),
  test_number: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  is_example: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  challenge_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  task_number: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  comment: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  explanation: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  input: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  output: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  task: z.union([ z.lazy(() => TaskRelationFilterSchema),z.lazy(() => TaskWhereInputSchema) ]).optional(),
  challenge: z.union([ z.lazy(() => ChallengeRelationFilterSchema),z.lazy(() => ChallengeWhereInputSchema) ]).optional(),
  Result: z.lazy(() => ResultListRelationFilterSchema).optional()
}).strict()) as z.ZodType<Prisma.TestWhereUniqueInput>;

export const TestOrderByWithAggregationInputSchema: z.ZodType<Prisma.TestOrderByWithAggregationInput> = z.object({
  test_number: z.lazy(() => SortOrderSchema).optional(),
  is_example: z.lazy(() => SortOrderSchema).optional(),
  challenge_id: z.lazy(() => SortOrderSchema).optional(),
  task_number: z.lazy(() => SortOrderSchema).optional(),
  comment: z.lazy(() => SortOrderSchema).optional(),
  explanation: z.lazy(() => SortOrderSchema).optional(),
  input: z.lazy(() => SortOrderSchema).optional(),
  output: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => TestCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => TestAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => TestMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => TestMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => TestSumOrderByAggregateInputSchema).optional()
}).strict() as z.ZodType<Prisma.TestOrderByWithAggregationInput>;

export const TestScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TestScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => TestScalarWhereWithAggregatesInputSchema),z.lazy(() => TestScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => TestScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TestScalarWhereWithAggregatesInputSchema),z.lazy(() => TestScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  test_number: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  is_example: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  challenge_id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  task_number: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  comment: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  explanation: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  input: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  output: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict() as z.ZodType<Prisma.TestScalarWhereWithAggregatesInput>;

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  username: z.string(),
  password: z.string(),
  force_reset_password: z.boolean().optional(),
  admin: z.boolean().optional(),
  submissions: z.lazy(() => SubmissionCreateNestedManyWithoutOwnerInputSchema).optional(),
  participants: z.lazy(() => ParticipantCreateNestedManyWithoutUserInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserCreateInput>;

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  username: z.string(),
  password: z.string(),
  force_reset_password: z.boolean().optional(),
  admin: z.boolean().optional(),
  submissions: z.lazy(() => SubmissionUncheckedCreateNestedManyWithoutOwnerInputSchema).optional(),
  participants: z.lazy(() => ParticipantUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserUncheckedCreateInput>;

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  force_reset_password: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  admin: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  submissions: z.lazy(() => SubmissionUpdateManyWithoutOwnerNestedInputSchema).optional(),
  participants: z.lazy(() => ParticipantUpdateManyWithoutUserNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserUpdateInput>;

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  force_reset_password: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  admin: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  submissions: z.lazy(() => SubmissionUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional(),
  participants: z.lazy(() => ParticipantUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserUncheckedUpdateInput>;

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  force_reset_password: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  admin: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.UserUpdateManyMutationInput>;

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  force_reset_password: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  admin: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.UserUncheckedUpdateManyInput>;

export const SubmissionCreateInputSchema: z.ZodType<Prisma.SubmissionCreateInput> = z.object({
  token: z.string(),
  src: z.string(),
  score: z.number().int().optional().nullable(),
  time: z.coerce.date(),
  owner: z.lazy(() => UserCreateNestedOneWithoutSubmissionsInputSchema),
  challenge: z.lazy(() => ContestChallengeCreateNestedOneWithoutSubmissionsInputSchema),
  results: z.lazy(() => ResultCreateNestedManyWithoutSubmissionInputSchema).optional()
}).strict() as z.ZodType<Prisma.SubmissionCreateInput>;

export const SubmissionUncheckedCreateInputSchema: z.ZodType<Prisma.SubmissionUncheckedCreateInput> = z.object({
  token: z.string(),
  owner_id: z.number().int(),
  src: z.string(),
  contest_id: z.string(),
  challenge_id: z.string(),
  score: z.number().int().optional().nullable(),
  time: z.coerce.date(),
  results: z.lazy(() => ResultUncheckedCreateNestedManyWithoutSubmissionInputSchema).optional()
}).strict() as z.ZodType<Prisma.SubmissionUncheckedCreateInput>;

export const SubmissionUpdateInputSchema: z.ZodType<Prisma.SubmissionUpdateInput> = z.object({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  src: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutSubmissionsNestedInputSchema).optional(),
  challenge: z.lazy(() => ContestChallengeUpdateOneRequiredWithoutSubmissionsNestedInputSchema).optional(),
  results: z.lazy(() => ResultUpdateManyWithoutSubmissionNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.SubmissionUpdateInput>;

export const SubmissionUncheckedUpdateInputSchema: z.ZodType<Prisma.SubmissionUncheckedUpdateInput> = z.object({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  owner_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  src: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contest_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  challenge_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  results: z.lazy(() => ResultUncheckedUpdateManyWithoutSubmissionNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.SubmissionUncheckedUpdateInput>;

export const SubmissionUpdateManyMutationInputSchema: z.ZodType<Prisma.SubmissionUpdateManyMutationInput> = z.object({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  src: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.SubmissionUpdateManyMutationInput>;

export const SubmissionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SubmissionUncheckedUpdateManyInput> = z.object({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  owner_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  src: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contest_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  challenge_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.SubmissionUncheckedUpdateManyInput>;

export const ResultCreateInputSchema: z.ZodType<Prisma.ResultCreateInput> = z.object({
  token: z.string(),
  time: z.number(),
  memory: z.number().int(),
  status: z.string(),
  compile_output: z.string(),
  submission: z.lazy(() => SubmissionCreateNestedOneWithoutResultsInputSchema),
  task: z.lazy(() => TaskCreateNestedOneWithoutResultInputSchema),
  test: z.lazy(() => TestCreateNestedOneWithoutResultInputSchema)
}).strict() as z.ZodType<Prisma.ResultCreateInput>;

export const ResultUncheckedCreateInputSchema: z.ZodType<Prisma.ResultUncheckedCreateInput> = z.object({
  submission_token: z.string(),
  challenge_id: z.string(),
  task_number: z.number().int(),
  test_number: z.number().int(),
  token: z.string(),
  time: z.number(),
  memory: z.number().int(),
  status: z.string(),
  compile_output: z.string()
}).strict() as z.ZodType<Prisma.ResultUncheckedCreateInput>;

export const ResultUpdateInputSchema: z.ZodType<Prisma.ResultUpdateInput> = z.object({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  memory: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  compile_output: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  submission: z.lazy(() => SubmissionUpdateOneRequiredWithoutResultsNestedInputSchema).optional(),
  task: z.lazy(() => TaskUpdateOneRequiredWithoutResultNestedInputSchema).optional(),
  test: z.lazy(() => TestUpdateOneRequiredWithoutResultNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.ResultUpdateInput>;

export const ResultUncheckedUpdateInputSchema: z.ZodType<Prisma.ResultUncheckedUpdateInput> = z.object({
  submission_token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  challenge_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  task_number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  test_number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  memory: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  compile_output: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ResultUncheckedUpdateInput>;

export const ResultUpdateManyMutationInputSchema: z.ZodType<Prisma.ResultUpdateManyMutationInput> = z.object({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  memory: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  compile_output: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ResultUpdateManyMutationInput>;

export const ResultUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ResultUncheckedUpdateManyInput> = z.object({
  submission_token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  challenge_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  task_number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  test_number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  memory: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  compile_output: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ResultUncheckedUpdateManyInput>;

export const ParticipantCreateInputSchema: z.ZodType<Prisma.ParticipantCreateInput> = z.object({
  time: z.coerce.date(),
  user: z.lazy(() => UserCreateNestedOneWithoutParticipantsInputSchema),
  contest: z.lazy(() => ContestCreateNestedOneWithoutParticipantsInputSchema)
}).strict() as z.ZodType<Prisma.ParticipantCreateInput>;

export const ParticipantUncheckedCreateInputSchema: z.ZodType<Prisma.ParticipantUncheckedCreateInput> = z.object({
  user_id: z.number().int(),
  contest_id: z.string(),
  time: z.coerce.date()
}).strict() as z.ZodType<Prisma.ParticipantUncheckedCreateInput>;

export const ParticipantUpdateInputSchema: z.ZodType<Prisma.ParticipantUpdateInput> = z.object({
  time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutParticipantsNestedInputSchema).optional(),
  contest: z.lazy(() => ContestUpdateOneRequiredWithoutParticipantsNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.ParticipantUpdateInput>;

export const ParticipantUncheckedUpdateInputSchema: z.ZodType<Prisma.ParticipantUncheckedUpdateInput> = z.object({
  user_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  contest_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ParticipantUncheckedUpdateInput>;

export const ParticipantUpdateManyMutationInputSchema: z.ZodType<Prisma.ParticipantUpdateManyMutationInput> = z.object({
  time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ParticipantUpdateManyMutationInput>;

export const ParticipantUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ParticipantUncheckedUpdateManyInput> = z.object({
  user_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  contest_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ParticipantUncheckedUpdateManyInput>;

export const ContestCreateInputSchema: z.ZodType<Prisma.ContestCreateInput> = z.object({
  id: z.string(),
  title: z.string(),
  start_time: z.coerce.date().optional().nullable(),
  end_time: z.coerce.date().optional().nullable(),
  description: z.string(),
  challenges: z.lazy(() => ContestChallengeCreateNestedManyWithoutContestInputSchema).optional(),
  participants: z.lazy(() => ParticipantCreateNestedManyWithoutContestInputSchema).optional()
}).strict() as z.ZodType<Prisma.ContestCreateInput>;

export const ContestUncheckedCreateInputSchema: z.ZodType<Prisma.ContestUncheckedCreateInput> = z.object({
  id: z.string(),
  title: z.string(),
  start_time: z.coerce.date().optional().nullable(),
  end_time: z.coerce.date().optional().nullable(),
  description: z.string(),
  challenges: z.lazy(() => ContestChallengeUncheckedCreateNestedManyWithoutContestInputSchema).optional(),
  participants: z.lazy(() => ParticipantUncheckedCreateNestedManyWithoutContestInputSchema).optional()
}).strict() as z.ZodType<Prisma.ContestUncheckedCreateInput>;

export const ContestUpdateInputSchema: z.ZodType<Prisma.ContestUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  start_time: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  end_time: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  challenges: z.lazy(() => ContestChallengeUpdateManyWithoutContestNestedInputSchema).optional(),
  participants: z.lazy(() => ParticipantUpdateManyWithoutContestNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.ContestUpdateInput>;

export const ContestUncheckedUpdateInputSchema: z.ZodType<Prisma.ContestUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  start_time: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  end_time: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  challenges: z.lazy(() => ContestChallengeUncheckedUpdateManyWithoutContestNestedInputSchema).optional(),
  participants: z.lazy(() => ParticipantUncheckedUpdateManyWithoutContestNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.ContestUncheckedUpdateInput>;

export const ContestUpdateManyMutationInputSchema: z.ZodType<Prisma.ContestUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  start_time: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  end_time: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ContestUpdateManyMutationInput>;

export const ContestUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ContestUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  start_time: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  end_time: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ContestUncheckedUpdateManyInput>;

export const ContestChallengeCreateInputSchema: z.ZodType<Prisma.ContestChallengeCreateInput> = z.object({
  max_score: z.number().int(),
  challenge: z.lazy(() => ChallengeCreateNestedOneWithoutContestsInputSchema),
  contest: z.lazy(() => ContestCreateNestedOneWithoutChallengesInputSchema),
  submissions: z.lazy(() => SubmissionCreateNestedManyWithoutChallengeInputSchema).optional()
}).strict() as z.ZodType<Prisma.ContestChallengeCreateInput>;

export const ContestChallengeUncheckedCreateInputSchema: z.ZodType<Prisma.ContestChallengeUncheckedCreateInput> = z.object({
  challenge_id: z.string(),
  contest_id: z.string(),
  max_score: z.number().int(),
  submissions: z.lazy(() => SubmissionUncheckedCreateNestedManyWithoutChallengeInputSchema).optional()
}).strict() as z.ZodType<Prisma.ContestChallengeUncheckedCreateInput>;

export const ContestChallengeUpdateInputSchema: z.ZodType<Prisma.ContestChallengeUpdateInput> = z.object({
  max_score: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  challenge: z.lazy(() => ChallengeUpdateOneRequiredWithoutContestsNestedInputSchema).optional(),
  contest: z.lazy(() => ContestUpdateOneRequiredWithoutChallengesNestedInputSchema).optional(),
  submissions: z.lazy(() => SubmissionUpdateManyWithoutChallengeNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.ContestChallengeUpdateInput>;

export const ContestChallengeUncheckedUpdateInputSchema: z.ZodType<Prisma.ContestChallengeUncheckedUpdateInput> = z.object({
  challenge_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contest_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  max_score: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  submissions: z.lazy(() => SubmissionUncheckedUpdateManyWithoutChallengeNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.ContestChallengeUncheckedUpdateInput>;

export const ContestChallengeUpdateManyMutationInputSchema: z.ZodType<Prisma.ContestChallengeUpdateManyMutationInput> = z.object({
  max_score: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ContestChallengeUpdateManyMutationInput>;

export const ContestChallengeUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ContestChallengeUncheckedUpdateManyInput> = z.object({
  challenge_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contest_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  max_score: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ContestChallengeUncheckedUpdateManyInput>;

export const ChallengeCreateInputSchema: z.ZodType<Prisma.ChallengeCreateInput> = z.object({
  id: z.string(),
  title: z.string(),
  type: z.string(),
  description: z.string(),
  input_format: z.string(),
  output_format: z.string(),
  time_limit: z.number().int(),
  memory_limit: z.number().int(),
  tasks: z.lazy(() => TaskCreateNestedManyWithoutChallengeInputSchema).optional(),
  contests: z.lazy(() => ContestChallengeCreateNestedManyWithoutChallengeInputSchema).optional(),
  tests: z.lazy(() => TestCreateNestedManyWithoutChallengeInputSchema).optional()
}).strict() as z.ZodType<Prisma.ChallengeCreateInput>;

export const ChallengeUncheckedCreateInputSchema: z.ZodType<Prisma.ChallengeUncheckedCreateInput> = z.object({
  id: z.string(),
  title: z.string(),
  type: z.string(),
  description: z.string(),
  input_format: z.string(),
  output_format: z.string(),
  time_limit: z.number().int(),
  memory_limit: z.number().int(),
  tasks: z.lazy(() => TaskUncheckedCreateNestedManyWithoutChallengeInputSchema).optional(),
  contests: z.lazy(() => ContestChallengeUncheckedCreateNestedManyWithoutChallengeInputSchema).optional(),
  tests: z.lazy(() => TestUncheckedCreateNestedManyWithoutChallengeInputSchema).optional()
}).strict() as z.ZodType<Prisma.ChallengeUncheckedCreateInput>;

export const ChallengeUpdateInputSchema: z.ZodType<Prisma.ChallengeUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  input_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  output_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time_limit: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  memory_limit: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  tasks: z.lazy(() => TaskUpdateManyWithoutChallengeNestedInputSchema).optional(),
  contests: z.lazy(() => ContestChallengeUpdateManyWithoutChallengeNestedInputSchema).optional(),
  tests: z.lazy(() => TestUpdateManyWithoutChallengeNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.ChallengeUpdateInput>;

export const ChallengeUncheckedUpdateInputSchema: z.ZodType<Prisma.ChallengeUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  input_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  output_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time_limit: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  memory_limit: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  tasks: z.lazy(() => TaskUncheckedUpdateManyWithoutChallengeNestedInputSchema).optional(),
  contests: z.lazy(() => ContestChallengeUncheckedUpdateManyWithoutChallengeNestedInputSchema).optional(),
  tests: z.lazy(() => TestUncheckedUpdateManyWithoutChallengeNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.ChallengeUncheckedUpdateInput>;

export const ChallengeUpdateManyMutationInputSchema: z.ZodType<Prisma.ChallengeUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  input_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  output_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time_limit: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  memory_limit: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ChallengeUpdateManyMutationInput>;

export const ChallengeUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ChallengeUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  input_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  output_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time_limit: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  memory_limit: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ChallengeUncheckedUpdateManyInput>;

export const TaskCreateInputSchema: z.ZodType<Prisma.TaskCreateInput> = z.object({
  type: z.string(),
  task_number: z.number().int(),
  weight: z.number().int(),
  challenge: z.lazy(() => ChallengeCreateNestedOneWithoutTasksInputSchema),
  tests: z.lazy(() => TestCreateNestedManyWithoutTaskInputSchema).optional(),
  Result: z.lazy(() => ResultCreateNestedManyWithoutTaskInputSchema).optional()
}).strict() as z.ZodType<Prisma.TaskCreateInput>;

export const TaskUncheckedCreateInputSchema: z.ZodType<Prisma.TaskUncheckedCreateInput> = z.object({
  challenge_id: z.string(),
  type: z.string(),
  task_number: z.number().int(),
  weight: z.number().int(),
  tests: z.lazy(() => TestUncheckedCreateNestedManyWithoutTaskInputSchema).optional(),
  Result: z.lazy(() => ResultUncheckedCreateNestedManyWithoutTaskInputSchema).optional()
}).strict() as z.ZodType<Prisma.TaskUncheckedCreateInput>;

export const TaskUpdateInputSchema: z.ZodType<Prisma.TaskUpdateInput> = z.object({
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  task_number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  weight: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  challenge: z.lazy(() => ChallengeUpdateOneRequiredWithoutTasksNestedInputSchema).optional(),
  tests: z.lazy(() => TestUpdateManyWithoutTaskNestedInputSchema).optional(),
  Result: z.lazy(() => ResultUpdateManyWithoutTaskNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.TaskUpdateInput>;

export const TaskUncheckedUpdateInputSchema: z.ZodType<Prisma.TaskUncheckedUpdateInput> = z.object({
  challenge_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  task_number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  weight: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  tests: z.lazy(() => TestUncheckedUpdateManyWithoutTaskNestedInputSchema).optional(),
  Result: z.lazy(() => ResultUncheckedUpdateManyWithoutTaskNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.TaskUncheckedUpdateInput>;

export const TaskUpdateManyMutationInputSchema: z.ZodType<Prisma.TaskUpdateManyMutationInput> = z.object({
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  task_number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  weight: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.TaskUpdateManyMutationInput>;

export const TaskUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TaskUncheckedUpdateManyInput> = z.object({
  challenge_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  task_number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  weight: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.TaskUncheckedUpdateManyInput>;

export const TestCreateInputSchema: z.ZodType<Prisma.TestCreateInput> = z.object({
  test_number: z.number().int(),
  is_example: z.boolean(),
  comment: z.string(),
  explanation: z.string(),
  input: z.string(),
  output: z.string(),
  task: z.lazy(() => TaskCreateNestedOneWithoutTestsInputSchema),
  challenge: z.lazy(() => ChallengeCreateNestedOneWithoutTestsInputSchema),
  Result: z.lazy(() => ResultCreateNestedManyWithoutTestInputSchema).optional()
}).strict() as z.ZodType<Prisma.TestCreateInput>;

export const TestUncheckedCreateInputSchema: z.ZodType<Prisma.TestUncheckedCreateInput> = z.object({
  test_number: z.number().int(),
  is_example: z.boolean(),
  challenge_id: z.string(),
  task_number: z.number().int(),
  comment: z.string(),
  explanation: z.string(),
  input: z.string(),
  output: z.string(),
  Result: z.lazy(() => ResultUncheckedCreateNestedManyWithoutTestInputSchema).optional()
}).strict() as z.ZodType<Prisma.TestUncheckedCreateInput>;

export const TestUpdateInputSchema: z.ZodType<Prisma.TestUpdateInput> = z.object({
  test_number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  is_example: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  comment: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  explanation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  input: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  output: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  task: z.lazy(() => TaskUpdateOneRequiredWithoutTestsNestedInputSchema).optional(),
  challenge: z.lazy(() => ChallengeUpdateOneRequiredWithoutTestsNestedInputSchema).optional(),
  Result: z.lazy(() => ResultUpdateManyWithoutTestNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.TestUpdateInput>;

export const TestUncheckedUpdateInputSchema: z.ZodType<Prisma.TestUncheckedUpdateInput> = z.object({
  test_number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  is_example: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  challenge_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  task_number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  comment: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  explanation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  input: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  output: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Result: z.lazy(() => ResultUncheckedUpdateManyWithoutTestNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.TestUncheckedUpdateInput>;

export const TestUpdateManyMutationInputSchema: z.ZodType<Prisma.TestUpdateManyMutationInput> = z.object({
  test_number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  is_example: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  comment: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  explanation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  input: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  output: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.TestUpdateManyMutationInput>;

export const TestUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TestUncheckedUpdateManyInput> = z.object({
  test_number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  is_example: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  challenge_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  task_number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  comment: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  explanation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  input: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  output: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.TestUncheckedUpdateManyInput>;

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.IntFilter>;

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.StringFilter>;

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.BoolFilter>;

export const SubmissionListRelationFilterSchema: z.ZodType<Prisma.SubmissionListRelationFilter> = z.object({
  every: z.lazy(() => SubmissionWhereInputSchema).optional(),
  some: z.lazy(() => SubmissionWhereInputSchema).optional(),
  none: z.lazy(() => SubmissionWhereInputSchema).optional()
}).strict() as z.ZodType<Prisma.SubmissionListRelationFilter>;

export const ParticipantListRelationFilterSchema: z.ZodType<Prisma.ParticipantListRelationFilter> = z.object({
  every: z.lazy(() => ParticipantWhereInputSchema).optional(),
  some: z.lazy(() => ParticipantWhereInputSchema).optional(),
  none: z.lazy(() => ParticipantWhereInputSchema).optional()
}).strict() as z.ZodType<Prisma.ParticipantListRelationFilter>;

export const SubmissionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.SubmissionOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.SubmissionOrderByRelationAggregateInput>;

export const ParticipantOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ParticipantOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ParticipantOrderByRelationAggregateInput>;

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  force_reset_password: z.lazy(() => SortOrderSchema).optional(),
  admin: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.UserCountOrderByAggregateInput>;

export const UserAvgOrderByAggregateInputSchema: z.ZodType<Prisma.UserAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.UserAvgOrderByAggregateInput>;

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  force_reset_password: z.lazy(() => SortOrderSchema).optional(),
  admin: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.UserMaxOrderByAggregateInput>;

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  username: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  force_reset_password: z.lazy(() => SortOrderSchema).optional(),
  admin: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.UserMinOrderByAggregateInput>;

export const UserSumOrderByAggregateInputSchema: z.ZodType<Prisma.UserSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.UserSumOrderByAggregateInput>;

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict() as z.ZodType<Prisma.IntWithAggregatesFilter>;

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict() as z.ZodType<Prisma.StringWithAggregatesFilter>;

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict() as z.ZodType<Prisma.BoolWithAggregatesFilter>;

export const IntNullableFilterSchema: z.ZodType<Prisma.IntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict() as z.ZodType<Prisma.IntNullableFilter>;

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.DateTimeFilter>;

export const UserRelationFilterSchema: z.ZodType<Prisma.UserRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserRelationFilter>;

export const ContestChallengeRelationFilterSchema: z.ZodType<Prisma.ContestChallengeRelationFilter> = z.object({
  is: z.lazy(() => ContestChallengeWhereInputSchema).optional(),
  isNot: z.lazy(() => ContestChallengeWhereInputSchema).optional()
}).strict() as z.ZodType<Prisma.ContestChallengeRelationFilter>;

export const ResultListRelationFilterSchema: z.ZodType<Prisma.ResultListRelationFilter> = z.object({
  every: z.lazy(() => ResultWhereInputSchema).optional(),
  some: z.lazy(() => ResultWhereInputSchema).optional(),
  none: z.lazy(() => ResultWhereInputSchema).optional()
}).strict() as z.ZodType<Prisma.ResultListRelationFilter>;

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict() as z.ZodType<Prisma.SortOrderInput>;

export const ResultOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ResultOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ResultOrderByRelationAggregateInput>;

export const SubmissionCountOrderByAggregateInputSchema: z.ZodType<Prisma.SubmissionCountOrderByAggregateInput> = z.object({
  token: z.lazy(() => SortOrderSchema).optional(),
  owner_id: z.lazy(() => SortOrderSchema).optional(),
  src: z.lazy(() => SortOrderSchema).optional(),
  contest_id: z.lazy(() => SortOrderSchema).optional(),
  challenge_id: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.SubmissionCountOrderByAggregateInput>;

export const SubmissionAvgOrderByAggregateInputSchema: z.ZodType<Prisma.SubmissionAvgOrderByAggregateInput> = z.object({
  owner_id: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.SubmissionAvgOrderByAggregateInput>;

export const SubmissionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SubmissionMaxOrderByAggregateInput> = z.object({
  token: z.lazy(() => SortOrderSchema).optional(),
  owner_id: z.lazy(() => SortOrderSchema).optional(),
  src: z.lazy(() => SortOrderSchema).optional(),
  contest_id: z.lazy(() => SortOrderSchema).optional(),
  challenge_id: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.SubmissionMaxOrderByAggregateInput>;

export const SubmissionMinOrderByAggregateInputSchema: z.ZodType<Prisma.SubmissionMinOrderByAggregateInput> = z.object({
  token: z.lazy(() => SortOrderSchema).optional(),
  owner_id: z.lazy(() => SortOrderSchema).optional(),
  src: z.lazy(() => SortOrderSchema).optional(),
  contest_id: z.lazy(() => SortOrderSchema).optional(),
  challenge_id: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.SubmissionMinOrderByAggregateInput>;

export const SubmissionSumOrderByAggregateInputSchema: z.ZodType<Prisma.SubmissionSumOrderByAggregateInput> = z.object({
  owner_id: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.SubmissionSumOrderByAggregateInput>;

export const IntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.IntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict() as z.ZodType<Prisma.IntNullableWithAggregatesFilter>;

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict() as z.ZodType<Prisma.DateTimeWithAggregatesFilter>;

export const FloatFilterSchema: z.ZodType<Prisma.FloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.FloatFilter>;

export const SubmissionRelationFilterSchema: z.ZodType<Prisma.SubmissionRelationFilter> = z.object({
  is: z.lazy(() => SubmissionWhereInputSchema).optional(),
  isNot: z.lazy(() => SubmissionWhereInputSchema).optional()
}).strict() as z.ZodType<Prisma.SubmissionRelationFilter>;

export const TaskRelationFilterSchema: z.ZodType<Prisma.TaskRelationFilter> = z.object({
  is: z.lazy(() => TaskWhereInputSchema).optional(),
  isNot: z.lazy(() => TaskWhereInputSchema).optional()
}).strict() as z.ZodType<Prisma.TaskRelationFilter>;

export const TestRelationFilterSchema: z.ZodType<Prisma.TestRelationFilter> = z.object({
  is: z.lazy(() => TestWhereInputSchema).optional(),
  isNot: z.lazy(() => TestWhereInputSchema).optional()
}).strict() as z.ZodType<Prisma.TestRelationFilter>;

export const ResultSubmission_tokenTask_numberTest_numberCompoundUniqueInputSchema: z.ZodType<Prisma.ResultSubmission_tokenTask_numberTest_numberCompoundUniqueInput> = z.object({
  submission_token: z.string(),
  task_number: z.number(),
  test_number: z.number()
}).strict() as z.ZodType<Prisma.ResultSubmission_tokenTask_numberTest_numberCompoundUniqueInput>;

export const ResultCountOrderByAggregateInputSchema: z.ZodType<Prisma.ResultCountOrderByAggregateInput> = z.object({
  submission_token: z.lazy(() => SortOrderSchema).optional(),
  challenge_id: z.lazy(() => SortOrderSchema).optional(),
  task_number: z.lazy(() => SortOrderSchema).optional(),
  test_number: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional(),
  memory: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  compile_output: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ResultCountOrderByAggregateInput>;

export const ResultAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ResultAvgOrderByAggregateInput> = z.object({
  task_number: z.lazy(() => SortOrderSchema).optional(),
  test_number: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional(),
  memory: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ResultAvgOrderByAggregateInput>;

export const ResultMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ResultMaxOrderByAggregateInput> = z.object({
  submission_token: z.lazy(() => SortOrderSchema).optional(),
  challenge_id: z.lazy(() => SortOrderSchema).optional(),
  task_number: z.lazy(() => SortOrderSchema).optional(),
  test_number: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional(),
  memory: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  compile_output: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ResultMaxOrderByAggregateInput>;

export const ResultMinOrderByAggregateInputSchema: z.ZodType<Prisma.ResultMinOrderByAggregateInput> = z.object({
  submission_token: z.lazy(() => SortOrderSchema).optional(),
  challenge_id: z.lazy(() => SortOrderSchema).optional(),
  task_number: z.lazy(() => SortOrderSchema).optional(),
  test_number: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional(),
  memory: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  compile_output: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ResultMinOrderByAggregateInput>;

export const ResultSumOrderByAggregateInputSchema: z.ZodType<Prisma.ResultSumOrderByAggregateInput> = z.object({
  task_number: z.lazy(() => SortOrderSchema).optional(),
  test_number: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional(),
  memory: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ResultSumOrderByAggregateInput>;

export const FloatWithAggregatesFilterSchema: z.ZodType<Prisma.FloatWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional()
}).strict() as z.ZodType<Prisma.FloatWithAggregatesFilter>;

export const ContestRelationFilterSchema: z.ZodType<Prisma.ContestRelationFilter> = z.object({
  is: z.lazy(() => ContestWhereInputSchema).optional(),
  isNot: z.lazy(() => ContestWhereInputSchema).optional()
}).strict() as z.ZodType<Prisma.ContestRelationFilter>;

export const ParticipantUser_idContest_idCompoundUniqueInputSchema: z.ZodType<Prisma.ParticipantUser_idContest_idCompoundUniqueInput> = z.object({
  user_id: z.number(),
  contest_id: z.string()
}).strict() as z.ZodType<Prisma.ParticipantUser_idContest_idCompoundUniqueInput>;

export const ParticipantCountOrderByAggregateInputSchema: z.ZodType<Prisma.ParticipantCountOrderByAggregateInput> = z.object({
  user_id: z.lazy(() => SortOrderSchema).optional(),
  contest_id: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ParticipantCountOrderByAggregateInput>;

export const ParticipantAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ParticipantAvgOrderByAggregateInput> = z.object({
  user_id: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ParticipantAvgOrderByAggregateInput>;

export const ParticipantMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ParticipantMaxOrderByAggregateInput> = z.object({
  user_id: z.lazy(() => SortOrderSchema).optional(),
  contest_id: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ParticipantMaxOrderByAggregateInput>;

export const ParticipantMinOrderByAggregateInputSchema: z.ZodType<Prisma.ParticipantMinOrderByAggregateInput> = z.object({
  user_id: z.lazy(() => SortOrderSchema).optional(),
  contest_id: z.lazy(() => SortOrderSchema).optional(),
  time: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ParticipantMinOrderByAggregateInput>;

export const ParticipantSumOrderByAggregateInputSchema: z.ZodType<Prisma.ParticipantSumOrderByAggregateInput> = z.object({
  user_id: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ParticipantSumOrderByAggregateInput>;

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict() as z.ZodType<Prisma.DateTimeNullableFilter>;

export const ContestChallengeListRelationFilterSchema: z.ZodType<Prisma.ContestChallengeListRelationFilter> = z.object({
  every: z.lazy(() => ContestChallengeWhereInputSchema).optional(),
  some: z.lazy(() => ContestChallengeWhereInputSchema).optional(),
  none: z.lazy(() => ContestChallengeWhereInputSchema).optional()
}).strict() as z.ZodType<Prisma.ContestChallengeListRelationFilter>;

export const ContestChallengeOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ContestChallengeOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ContestChallengeOrderByRelationAggregateInput>;

export const ContestCountOrderByAggregateInputSchema: z.ZodType<Prisma.ContestCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  start_time: z.lazy(() => SortOrderSchema).optional(),
  end_time: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ContestCountOrderByAggregateInput>;

export const ContestMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ContestMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  start_time: z.lazy(() => SortOrderSchema).optional(),
  end_time: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ContestMaxOrderByAggregateInput>;

export const ContestMinOrderByAggregateInputSchema: z.ZodType<Prisma.ContestMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  start_time: z.lazy(() => SortOrderSchema).optional(),
  end_time: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ContestMinOrderByAggregateInput>;

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict() as z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter>;

export const ChallengeRelationFilterSchema: z.ZodType<Prisma.ChallengeRelationFilter> = z.object({
  is: z.lazy(() => ChallengeWhereInputSchema).optional(),
  isNot: z.lazy(() => ChallengeWhereInputSchema).optional()
}).strict() as z.ZodType<Prisma.ChallengeRelationFilter>;

export const ContestChallengeChallenge_idContest_idCompoundUniqueInputSchema: z.ZodType<Prisma.ContestChallengeChallenge_idContest_idCompoundUniqueInput> = z.object({
  challenge_id: z.string(),
  contest_id: z.string()
}).strict() as z.ZodType<Prisma.ContestChallengeChallenge_idContest_idCompoundUniqueInput>;

export const ContestChallengeCountOrderByAggregateInputSchema: z.ZodType<Prisma.ContestChallengeCountOrderByAggregateInput> = z.object({
  challenge_id: z.lazy(() => SortOrderSchema).optional(),
  contest_id: z.lazy(() => SortOrderSchema).optional(),
  max_score: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ContestChallengeCountOrderByAggregateInput>;

export const ContestChallengeAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ContestChallengeAvgOrderByAggregateInput> = z.object({
  max_score: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ContestChallengeAvgOrderByAggregateInput>;

export const ContestChallengeMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ContestChallengeMaxOrderByAggregateInput> = z.object({
  challenge_id: z.lazy(() => SortOrderSchema).optional(),
  contest_id: z.lazy(() => SortOrderSchema).optional(),
  max_score: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ContestChallengeMaxOrderByAggregateInput>;

export const ContestChallengeMinOrderByAggregateInputSchema: z.ZodType<Prisma.ContestChallengeMinOrderByAggregateInput> = z.object({
  challenge_id: z.lazy(() => SortOrderSchema).optional(),
  contest_id: z.lazy(() => SortOrderSchema).optional(),
  max_score: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ContestChallengeMinOrderByAggregateInput>;

export const ContestChallengeSumOrderByAggregateInputSchema: z.ZodType<Prisma.ContestChallengeSumOrderByAggregateInput> = z.object({
  max_score: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ContestChallengeSumOrderByAggregateInput>;

export const TaskListRelationFilterSchema: z.ZodType<Prisma.TaskListRelationFilter> = z.object({
  every: z.lazy(() => TaskWhereInputSchema).optional(),
  some: z.lazy(() => TaskWhereInputSchema).optional(),
  none: z.lazy(() => TaskWhereInputSchema).optional()
}).strict() as z.ZodType<Prisma.TaskListRelationFilter>;

export const TestListRelationFilterSchema: z.ZodType<Prisma.TestListRelationFilter> = z.object({
  every: z.lazy(() => TestWhereInputSchema).optional(),
  some: z.lazy(() => TestWhereInputSchema).optional(),
  none: z.lazy(() => TestWhereInputSchema).optional()
}).strict() as z.ZodType<Prisma.TestListRelationFilter>;

export const TaskOrderByRelationAggregateInputSchema: z.ZodType<Prisma.TaskOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.TaskOrderByRelationAggregateInput>;

export const TestOrderByRelationAggregateInputSchema: z.ZodType<Prisma.TestOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.TestOrderByRelationAggregateInput>;

export const ChallengeCountOrderByAggregateInputSchema: z.ZodType<Prisma.ChallengeCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  input_format: z.lazy(() => SortOrderSchema).optional(),
  output_format: z.lazy(() => SortOrderSchema).optional(),
  time_limit: z.lazy(() => SortOrderSchema).optional(),
  memory_limit: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ChallengeCountOrderByAggregateInput>;

export const ChallengeAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ChallengeAvgOrderByAggregateInput> = z.object({
  time_limit: z.lazy(() => SortOrderSchema).optional(),
  memory_limit: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ChallengeAvgOrderByAggregateInput>;

export const ChallengeMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ChallengeMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  input_format: z.lazy(() => SortOrderSchema).optional(),
  output_format: z.lazy(() => SortOrderSchema).optional(),
  time_limit: z.lazy(() => SortOrderSchema).optional(),
  memory_limit: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ChallengeMaxOrderByAggregateInput>;

export const ChallengeMinOrderByAggregateInputSchema: z.ZodType<Prisma.ChallengeMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  input_format: z.lazy(() => SortOrderSchema).optional(),
  output_format: z.lazy(() => SortOrderSchema).optional(),
  time_limit: z.lazy(() => SortOrderSchema).optional(),
  memory_limit: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ChallengeMinOrderByAggregateInput>;

export const ChallengeSumOrderByAggregateInputSchema: z.ZodType<Prisma.ChallengeSumOrderByAggregateInput> = z.object({
  time_limit: z.lazy(() => SortOrderSchema).optional(),
  memory_limit: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.ChallengeSumOrderByAggregateInput>;

export const TaskChallenge_idTask_numberCompoundUniqueInputSchema: z.ZodType<Prisma.TaskChallenge_idTask_numberCompoundUniqueInput> = z.object({
  challenge_id: z.string(),
  task_number: z.number()
}).strict() as z.ZodType<Prisma.TaskChallenge_idTask_numberCompoundUniqueInput>;

export const TaskCountOrderByAggregateInputSchema: z.ZodType<Prisma.TaskCountOrderByAggregateInput> = z.object({
  challenge_id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  task_number: z.lazy(() => SortOrderSchema).optional(),
  weight: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.TaskCountOrderByAggregateInput>;

export const TaskAvgOrderByAggregateInputSchema: z.ZodType<Prisma.TaskAvgOrderByAggregateInput> = z.object({
  task_number: z.lazy(() => SortOrderSchema).optional(),
  weight: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.TaskAvgOrderByAggregateInput>;

export const TaskMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TaskMaxOrderByAggregateInput> = z.object({
  challenge_id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  task_number: z.lazy(() => SortOrderSchema).optional(),
  weight: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.TaskMaxOrderByAggregateInput>;

export const TaskMinOrderByAggregateInputSchema: z.ZodType<Prisma.TaskMinOrderByAggregateInput> = z.object({
  challenge_id: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  task_number: z.lazy(() => SortOrderSchema).optional(),
  weight: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.TaskMinOrderByAggregateInput>;

export const TaskSumOrderByAggregateInputSchema: z.ZodType<Prisma.TaskSumOrderByAggregateInput> = z.object({
  task_number: z.lazy(() => SortOrderSchema).optional(),
  weight: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.TaskSumOrderByAggregateInput>;

export const TestChallenge_idTask_numberTest_numberCompoundUniqueInputSchema: z.ZodType<Prisma.TestChallenge_idTask_numberTest_numberCompoundUniqueInput> = z.object({
  challenge_id: z.string(),
  task_number: z.number(),
  test_number: z.number()
}).strict() as z.ZodType<Prisma.TestChallenge_idTask_numberTest_numberCompoundUniqueInput>;

export const TestCountOrderByAggregateInputSchema: z.ZodType<Prisma.TestCountOrderByAggregateInput> = z.object({
  test_number: z.lazy(() => SortOrderSchema).optional(),
  is_example: z.lazy(() => SortOrderSchema).optional(),
  challenge_id: z.lazy(() => SortOrderSchema).optional(),
  task_number: z.lazy(() => SortOrderSchema).optional(),
  comment: z.lazy(() => SortOrderSchema).optional(),
  explanation: z.lazy(() => SortOrderSchema).optional(),
  input: z.lazy(() => SortOrderSchema).optional(),
  output: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.TestCountOrderByAggregateInput>;

export const TestAvgOrderByAggregateInputSchema: z.ZodType<Prisma.TestAvgOrderByAggregateInput> = z.object({
  test_number: z.lazy(() => SortOrderSchema).optional(),
  task_number: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.TestAvgOrderByAggregateInput>;

export const TestMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TestMaxOrderByAggregateInput> = z.object({
  test_number: z.lazy(() => SortOrderSchema).optional(),
  is_example: z.lazy(() => SortOrderSchema).optional(),
  challenge_id: z.lazy(() => SortOrderSchema).optional(),
  task_number: z.lazy(() => SortOrderSchema).optional(),
  comment: z.lazy(() => SortOrderSchema).optional(),
  explanation: z.lazy(() => SortOrderSchema).optional(),
  input: z.lazy(() => SortOrderSchema).optional(),
  output: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.TestMaxOrderByAggregateInput>;

export const TestMinOrderByAggregateInputSchema: z.ZodType<Prisma.TestMinOrderByAggregateInput> = z.object({
  test_number: z.lazy(() => SortOrderSchema).optional(),
  is_example: z.lazy(() => SortOrderSchema).optional(),
  challenge_id: z.lazy(() => SortOrderSchema).optional(),
  task_number: z.lazy(() => SortOrderSchema).optional(),
  comment: z.lazy(() => SortOrderSchema).optional(),
  explanation: z.lazy(() => SortOrderSchema).optional(),
  input: z.lazy(() => SortOrderSchema).optional(),
  output: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.TestMinOrderByAggregateInput>;

export const TestSumOrderByAggregateInputSchema: z.ZodType<Prisma.TestSumOrderByAggregateInput> = z.object({
  test_number: z.lazy(() => SortOrderSchema).optional(),
  task_number: z.lazy(() => SortOrderSchema).optional()
}).strict() as z.ZodType<Prisma.TestSumOrderByAggregateInput>;

export const SubmissionCreateNestedManyWithoutOwnerInputSchema: z.ZodType<Prisma.SubmissionCreateNestedManyWithoutOwnerInput> = z.object({
  create: z.union([ z.lazy(() => SubmissionCreateWithoutOwnerInputSchema),z.lazy(() => SubmissionCreateWithoutOwnerInputSchema).array(),z.lazy(() => SubmissionUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => SubmissionUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SubmissionCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => SubmissionCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.SubmissionCreateNestedManyWithoutOwnerInput>;

export const ParticipantCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ParticipantCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ParticipantCreateWithoutUserInputSchema),z.lazy(() => ParticipantCreateWithoutUserInputSchema).array(),z.lazy(() => ParticipantUncheckedCreateWithoutUserInputSchema),z.lazy(() => ParticipantUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ParticipantCreateOrConnectWithoutUserInputSchema),z.lazy(() => ParticipantCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ParticipantCreateNestedManyWithoutUserInput>;

export const SubmissionUncheckedCreateNestedManyWithoutOwnerInputSchema: z.ZodType<Prisma.SubmissionUncheckedCreateNestedManyWithoutOwnerInput> = z.object({
  create: z.union([ z.lazy(() => SubmissionCreateWithoutOwnerInputSchema),z.lazy(() => SubmissionCreateWithoutOwnerInputSchema).array(),z.lazy(() => SubmissionUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => SubmissionUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SubmissionCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => SubmissionCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.SubmissionUncheckedCreateNestedManyWithoutOwnerInput>;

export const ParticipantUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ParticipantUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ParticipantCreateWithoutUserInputSchema),z.lazy(() => ParticipantCreateWithoutUserInputSchema).array(),z.lazy(() => ParticipantUncheckedCreateWithoutUserInputSchema),z.lazy(() => ParticipantUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ParticipantCreateOrConnectWithoutUserInputSchema),z.lazy(() => ParticipantCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ParticipantUncheckedCreateNestedManyWithoutUserInput>;

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict() as z.ZodType<Prisma.StringFieldUpdateOperationsInput>;

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict() as z.ZodType<Prisma.BoolFieldUpdateOperationsInput>;

export const SubmissionUpdateManyWithoutOwnerNestedInputSchema: z.ZodType<Prisma.SubmissionUpdateManyWithoutOwnerNestedInput> = z.object({
  create: z.union([ z.lazy(() => SubmissionCreateWithoutOwnerInputSchema),z.lazy(() => SubmissionCreateWithoutOwnerInputSchema).array(),z.lazy(() => SubmissionUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => SubmissionUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SubmissionCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => SubmissionCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SubmissionUpsertWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => SubmissionUpsertWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SubmissionUpdateWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => SubmissionUpdateWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SubmissionUpdateManyWithWhereWithoutOwnerInputSchema),z.lazy(() => SubmissionUpdateManyWithWhereWithoutOwnerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SubmissionScalarWhereInputSchema),z.lazy(() => SubmissionScalarWhereInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.SubmissionUpdateManyWithoutOwnerNestedInput>;

export const ParticipantUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ParticipantUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ParticipantCreateWithoutUserInputSchema),z.lazy(() => ParticipantCreateWithoutUserInputSchema).array(),z.lazy(() => ParticipantUncheckedCreateWithoutUserInputSchema),z.lazy(() => ParticipantUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ParticipantCreateOrConnectWithoutUserInputSchema),z.lazy(() => ParticipantCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ParticipantUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ParticipantUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ParticipantUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ParticipantUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ParticipantUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ParticipantUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ParticipantScalarWhereInputSchema),z.lazy(() => ParticipantScalarWhereInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ParticipantUpdateManyWithoutUserNestedInput>;

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict() as z.ZodType<Prisma.IntFieldUpdateOperationsInput>;

export const SubmissionUncheckedUpdateManyWithoutOwnerNestedInputSchema: z.ZodType<Prisma.SubmissionUncheckedUpdateManyWithoutOwnerNestedInput> = z.object({
  create: z.union([ z.lazy(() => SubmissionCreateWithoutOwnerInputSchema),z.lazy(() => SubmissionCreateWithoutOwnerInputSchema).array(),z.lazy(() => SubmissionUncheckedCreateWithoutOwnerInputSchema),z.lazy(() => SubmissionUncheckedCreateWithoutOwnerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SubmissionCreateOrConnectWithoutOwnerInputSchema),z.lazy(() => SubmissionCreateOrConnectWithoutOwnerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SubmissionUpsertWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => SubmissionUpsertWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SubmissionUpdateWithWhereUniqueWithoutOwnerInputSchema),z.lazy(() => SubmissionUpdateWithWhereUniqueWithoutOwnerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SubmissionUpdateManyWithWhereWithoutOwnerInputSchema),z.lazy(() => SubmissionUpdateManyWithWhereWithoutOwnerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SubmissionScalarWhereInputSchema),z.lazy(() => SubmissionScalarWhereInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.SubmissionUncheckedUpdateManyWithoutOwnerNestedInput>;

export const ParticipantUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ParticipantUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ParticipantCreateWithoutUserInputSchema),z.lazy(() => ParticipantCreateWithoutUserInputSchema).array(),z.lazy(() => ParticipantUncheckedCreateWithoutUserInputSchema),z.lazy(() => ParticipantUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ParticipantCreateOrConnectWithoutUserInputSchema),z.lazy(() => ParticipantCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ParticipantUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ParticipantUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ParticipantUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ParticipantUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ParticipantUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ParticipantUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ParticipantScalarWhereInputSchema),z.lazy(() => ParticipantScalarWhereInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ParticipantUncheckedUpdateManyWithoutUserNestedInput>;

export const UserCreateNestedOneWithoutSubmissionsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutSubmissionsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSubmissionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSubmissionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSubmissionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserCreateNestedOneWithoutSubmissionsInput>;

export const ContestChallengeCreateNestedOneWithoutSubmissionsInputSchema: z.ZodType<Prisma.ContestChallengeCreateNestedOneWithoutSubmissionsInput> = z.object({
  create: z.union([ z.lazy(() => ContestChallengeCreateWithoutSubmissionsInputSchema),z.lazy(() => ContestChallengeUncheckedCreateWithoutSubmissionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ContestChallengeCreateOrConnectWithoutSubmissionsInputSchema).optional(),
  connect: z.lazy(() => ContestChallengeWhereUniqueInputSchema).optional()
}).strict() as z.ZodType<Prisma.ContestChallengeCreateNestedOneWithoutSubmissionsInput>;

export const ResultCreateNestedManyWithoutSubmissionInputSchema: z.ZodType<Prisma.ResultCreateNestedManyWithoutSubmissionInput> = z.object({
  create: z.union([ z.lazy(() => ResultCreateWithoutSubmissionInputSchema),z.lazy(() => ResultCreateWithoutSubmissionInputSchema).array(),z.lazy(() => ResultUncheckedCreateWithoutSubmissionInputSchema),z.lazy(() => ResultUncheckedCreateWithoutSubmissionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResultCreateOrConnectWithoutSubmissionInputSchema),z.lazy(() => ResultCreateOrConnectWithoutSubmissionInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResultWhereUniqueInputSchema),z.lazy(() => ResultWhereUniqueInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ResultCreateNestedManyWithoutSubmissionInput>;

export const ResultUncheckedCreateNestedManyWithoutSubmissionInputSchema: z.ZodType<Prisma.ResultUncheckedCreateNestedManyWithoutSubmissionInput> = z.object({
  create: z.union([ z.lazy(() => ResultCreateWithoutSubmissionInputSchema),z.lazy(() => ResultCreateWithoutSubmissionInputSchema).array(),z.lazy(() => ResultUncheckedCreateWithoutSubmissionInputSchema),z.lazy(() => ResultUncheckedCreateWithoutSubmissionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResultCreateOrConnectWithoutSubmissionInputSchema),z.lazy(() => ResultCreateOrConnectWithoutSubmissionInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResultWhereUniqueInputSchema),z.lazy(() => ResultWhereUniqueInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ResultUncheckedCreateNestedManyWithoutSubmissionInput>;

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict() as z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput>;

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict() as z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput>;

export const UserUpdateOneRequiredWithoutSubmissionsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutSubmissionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSubmissionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSubmissionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSubmissionsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutSubmissionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutSubmissionsInputSchema),z.lazy(() => UserUpdateWithoutSubmissionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSubmissionsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.UserUpdateOneRequiredWithoutSubmissionsNestedInput>;

export const ContestChallengeUpdateOneRequiredWithoutSubmissionsNestedInputSchema: z.ZodType<Prisma.ContestChallengeUpdateOneRequiredWithoutSubmissionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContestChallengeCreateWithoutSubmissionsInputSchema),z.lazy(() => ContestChallengeUncheckedCreateWithoutSubmissionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ContestChallengeCreateOrConnectWithoutSubmissionsInputSchema).optional(),
  upsert: z.lazy(() => ContestChallengeUpsertWithoutSubmissionsInputSchema).optional(),
  connect: z.lazy(() => ContestChallengeWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ContestChallengeUpdateToOneWithWhereWithoutSubmissionsInputSchema),z.lazy(() => ContestChallengeUpdateWithoutSubmissionsInputSchema),z.lazy(() => ContestChallengeUncheckedUpdateWithoutSubmissionsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ContestChallengeUpdateOneRequiredWithoutSubmissionsNestedInput>;

export const ResultUpdateManyWithoutSubmissionNestedInputSchema: z.ZodType<Prisma.ResultUpdateManyWithoutSubmissionNestedInput> = z.object({
  create: z.union([ z.lazy(() => ResultCreateWithoutSubmissionInputSchema),z.lazy(() => ResultCreateWithoutSubmissionInputSchema).array(),z.lazy(() => ResultUncheckedCreateWithoutSubmissionInputSchema),z.lazy(() => ResultUncheckedCreateWithoutSubmissionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResultCreateOrConnectWithoutSubmissionInputSchema),z.lazy(() => ResultCreateOrConnectWithoutSubmissionInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ResultUpsertWithWhereUniqueWithoutSubmissionInputSchema),z.lazy(() => ResultUpsertWithWhereUniqueWithoutSubmissionInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => ResultWhereUniqueInputSchema),z.lazy(() => ResultWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ResultWhereUniqueInputSchema),z.lazy(() => ResultWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ResultWhereUniqueInputSchema),z.lazy(() => ResultWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResultWhereUniqueInputSchema),z.lazy(() => ResultWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ResultUpdateWithWhereUniqueWithoutSubmissionInputSchema),z.lazy(() => ResultUpdateWithWhereUniqueWithoutSubmissionInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ResultUpdateManyWithWhereWithoutSubmissionInputSchema),z.lazy(() => ResultUpdateManyWithWhereWithoutSubmissionInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ResultScalarWhereInputSchema),z.lazy(() => ResultScalarWhereInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ResultUpdateManyWithoutSubmissionNestedInput>;

export const ResultUncheckedUpdateManyWithoutSubmissionNestedInputSchema: z.ZodType<Prisma.ResultUncheckedUpdateManyWithoutSubmissionNestedInput> = z.object({
  create: z.union([ z.lazy(() => ResultCreateWithoutSubmissionInputSchema),z.lazy(() => ResultCreateWithoutSubmissionInputSchema).array(),z.lazy(() => ResultUncheckedCreateWithoutSubmissionInputSchema),z.lazy(() => ResultUncheckedCreateWithoutSubmissionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResultCreateOrConnectWithoutSubmissionInputSchema),z.lazy(() => ResultCreateOrConnectWithoutSubmissionInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ResultUpsertWithWhereUniqueWithoutSubmissionInputSchema),z.lazy(() => ResultUpsertWithWhereUniqueWithoutSubmissionInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => ResultWhereUniqueInputSchema),z.lazy(() => ResultWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ResultWhereUniqueInputSchema),z.lazy(() => ResultWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ResultWhereUniqueInputSchema),z.lazy(() => ResultWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResultWhereUniqueInputSchema),z.lazy(() => ResultWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ResultUpdateWithWhereUniqueWithoutSubmissionInputSchema),z.lazy(() => ResultUpdateWithWhereUniqueWithoutSubmissionInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ResultUpdateManyWithWhereWithoutSubmissionInputSchema),z.lazy(() => ResultUpdateManyWithWhereWithoutSubmissionInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ResultScalarWhereInputSchema),z.lazy(() => ResultScalarWhereInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ResultUncheckedUpdateManyWithoutSubmissionNestedInput>;

export const SubmissionCreateNestedOneWithoutResultsInputSchema: z.ZodType<Prisma.SubmissionCreateNestedOneWithoutResultsInput> = z.object({
  create: z.union([ z.lazy(() => SubmissionCreateWithoutResultsInputSchema),z.lazy(() => SubmissionUncheckedCreateWithoutResultsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SubmissionCreateOrConnectWithoutResultsInputSchema).optional(),
  connect: z.lazy(() => SubmissionWhereUniqueInputSchema).optional()
}).strict() as z.ZodType<Prisma.SubmissionCreateNestedOneWithoutResultsInput>;

export const TaskCreateNestedOneWithoutResultInputSchema: z.ZodType<Prisma.TaskCreateNestedOneWithoutResultInput> = z.object({
  create: z.union([ z.lazy(() => TaskCreateWithoutResultInputSchema),z.lazy(() => TaskUncheckedCreateWithoutResultInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TaskCreateOrConnectWithoutResultInputSchema).optional(),
  connect: z.lazy(() => TaskWhereUniqueInputSchema).optional()
}).strict() as z.ZodType<Prisma.TaskCreateNestedOneWithoutResultInput>;

export const TestCreateNestedOneWithoutResultInputSchema: z.ZodType<Prisma.TestCreateNestedOneWithoutResultInput> = z.object({
  create: z.union([ z.lazy(() => TestCreateWithoutResultInputSchema),z.lazy(() => TestUncheckedCreateWithoutResultInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TestCreateOrConnectWithoutResultInputSchema).optional(),
  connect: z.lazy(() => TestWhereUniqueInputSchema).optional()
}).strict() as z.ZodType<Prisma.TestCreateNestedOneWithoutResultInput>;

export const FloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.FloatFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict() as z.ZodType<Prisma.FloatFieldUpdateOperationsInput>;

export const SubmissionUpdateOneRequiredWithoutResultsNestedInputSchema: z.ZodType<Prisma.SubmissionUpdateOneRequiredWithoutResultsNestedInput> = z.object({
  create: z.union([ z.lazy(() => SubmissionCreateWithoutResultsInputSchema),z.lazy(() => SubmissionUncheckedCreateWithoutResultsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SubmissionCreateOrConnectWithoutResultsInputSchema).optional(),
  upsert: z.lazy(() => SubmissionUpsertWithoutResultsInputSchema).optional(),
  connect: z.lazy(() => SubmissionWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => SubmissionUpdateToOneWithWhereWithoutResultsInputSchema),z.lazy(() => SubmissionUpdateWithoutResultsInputSchema),z.lazy(() => SubmissionUncheckedUpdateWithoutResultsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.SubmissionUpdateOneRequiredWithoutResultsNestedInput>;

export const TaskUpdateOneRequiredWithoutResultNestedInputSchema: z.ZodType<Prisma.TaskUpdateOneRequiredWithoutResultNestedInput> = z.object({
  create: z.union([ z.lazy(() => TaskCreateWithoutResultInputSchema),z.lazy(() => TaskUncheckedCreateWithoutResultInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TaskCreateOrConnectWithoutResultInputSchema).optional(),
  upsert: z.lazy(() => TaskUpsertWithoutResultInputSchema).optional(),
  connect: z.lazy(() => TaskWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => TaskUpdateToOneWithWhereWithoutResultInputSchema),z.lazy(() => TaskUpdateWithoutResultInputSchema),z.lazy(() => TaskUncheckedUpdateWithoutResultInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.TaskUpdateOneRequiredWithoutResultNestedInput>;

export const TestUpdateOneRequiredWithoutResultNestedInputSchema: z.ZodType<Prisma.TestUpdateOneRequiredWithoutResultNestedInput> = z.object({
  create: z.union([ z.lazy(() => TestCreateWithoutResultInputSchema),z.lazy(() => TestUncheckedCreateWithoutResultInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TestCreateOrConnectWithoutResultInputSchema).optional(),
  upsert: z.lazy(() => TestUpsertWithoutResultInputSchema).optional(),
  connect: z.lazy(() => TestWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => TestUpdateToOneWithWhereWithoutResultInputSchema),z.lazy(() => TestUpdateWithoutResultInputSchema),z.lazy(() => TestUncheckedUpdateWithoutResultInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.TestUpdateOneRequiredWithoutResultNestedInput>;

export const UserCreateNestedOneWithoutParticipantsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutParticipantsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutParticipantsInputSchema),z.lazy(() => UserUncheckedCreateWithoutParticipantsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutParticipantsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserCreateNestedOneWithoutParticipantsInput>;

export const ContestCreateNestedOneWithoutParticipantsInputSchema: z.ZodType<Prisma.ContestCreateNestedOneWithoutParticipantsInput> = z.object({
  create: z.union([ z.lazy(() => ContestCreateWithoutParticipantsInputSchema),z.lazy(() => ContestUncheckedCreateWithoutParticipantsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ContestCreateOrConnectWithoutParticipantsInputSchema).optional(),
  connect: z.lazy(() => ContestWhereUniqueInputSchema).optional()
}).strict() as z.ZodType<Prisma.ContestCreateNestedOneWithoutParticipantsInput>;

export const UserUpdateOneRequiredWithoutParticipantsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutParticipantsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutParticipantsInputSchema),z.lazy(() => UserUncheckedCreateWithoutParticipantsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutParticipantsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutParticipantsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutParticipantsInputSchema),z.lazy(() => UserUpdateWithoutParticipantsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutParticipantsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.UserUpdateOneRequiredWithoutParticipantsNestedInput>;

export const ContestUpdateOneRequiredWithoutParticipantsNestedInputSchema: z.ZodType<Prisma.ContestUpdateOneRequiredWithoutParticipantsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContestCreateWithoutParticipantsInputSchema),z.lazy(() => ContestUncheckedCreateWithoutParticipantsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ContestCreateOrConnectWithoutParticipantsInputSchema).optional(),
  upsert: z.lazy(() => ContestUpsertWithoutParticipantsInputSchema).optional(),
  connect: z.lazy(() => ContestWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ContestUpdateToOneWithWhereWithoutParticipantsInputSchema),z.lazy(() => ContestUpdateWithoutParticipantsInputSchema),z.lazy(() => ContestUncheckedUpdateWithoutParticipantsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ContestUpdateOneRequiredWithoutParticipantsNestedInput>;

export const ContestChallengeCreateNestedManyWithoutContestInputSchema: z.ZodType<Prisma.ContestChallengeCreateNestedManyWithoutContestInput> = z.object({
  create: z.union([ z.lazy(() => ContestChallengeCreateWithoutContestInputSchema),z.lazy(() => ContestChallengeCreateWithoutContestInputSchema).array(),z.lazy(() => ContestChallengeUncheckedCreateWithoutContestInputSchema),z.lazy(() => ContestChallengeUncheckedCreateWithoutContestInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContestChallengeCreateOrConnectWithoutContestInputSchema),z.lazy(() => ContestChallengeCreateOrConnectWithoutContestInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ContestChallengeWhereUniqueInputSchema),z.lazy(() => ContestChallengeWhereUniqueInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ContestChallengeCreateNestedManyWithoutContestInput>;

export const ParticipantCreateNestedManyWithoutContestInputSchema: z.ZodType<Prisma.ParticipantCreateNestedManyWithoutContestInput> = z.object({
  create: z.union([ z.lazy(() => ParticipantCreateWithoutContestInputSchema),z.lazy(() => ParticipantCreateWithoutContestInputSchema).array(),z.lazy(() => ParticipantUncheckedCreateWithoutContestInputSchema),z.lazy(() => ParticipantUncheckedCreateWithoutContestInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ParticipantCreateOrConnectWithoutContestInputSchema),z.lazy(() => ParticipantCreateOrConnectWithoutContestInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ParticipantCreateNestedManyWithoutContestInput>;

export const ContestChallengeUncheckedCreateNestedManyWithoutContestInputSchema: z.ZodType<Prisma.ContestChallengeUncheckedCreateNestedManyWithoutContestInput> = z.object({
  create: z.union([ z.lazy(() => ContestChallengeCreateWithoutContestInputSchema),z.lazy(() => ContestChallengeCreateWithoutContestInputSchema).array(),z.lazy(() => ContestChallengeUncheckedCreateWithoutContestInputSchema),z.lazy(() => ContestChallengeUncheckedCreateWithoutContestInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContestChallengeCreateOrConnectWithoutContestInputSchema),z.lazy(() => ContestChallengeCreateOrConnectWithoutContestInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ContestChallengeWhereUniqueInputSchema),z.lazy(() => ContestChallengeWhereUniqueInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ContestChallengeUncheckedCreateNestedManyWithoutContestInput>;

export const ParticipantUncheckedCreateNestedManyWithoutContestInputSchema: z.ZodType<Prisma.ParticipantUncheckedCreateNestedManyWithoutContestInput> = z.object({
  create: z.union([ z.lazy(() => ParticipantCreateWithoutContestInputSchema),z.lazy(() => ParticipantCreateWithoutContestInputSchema).array(),z.lazy(() => ParticipantUncheckedCreateWithoutContestInputSchema),z.lazy(() => ParticipantUncheckedCreateWithoutContestInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ParticipantCreateOrConnectWithoutContestInputSchema),z.lazy(() => ParticipantCreateOrConnectWithoutContestInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ParticipantUncheckedCreateNestedManyWithoutContestInput>;

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional().nullable()
}).strict() as z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput>;

export const ContestChallengeUpdateManyWithoutContestNestedInputSchema: z.ZodType<Prisma.ContestChallengeUpdateManyWithoutContestNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContestChallengeCreateWithoutContestInputSchema),z.lazy(() => ContestChallengeCreateWithoutContestInputSchema).array(),z.lazy(() => ContestChallengeUncheckedCreateWithoutContestInputSchema),z.lazy(() => ContestChallengeUncheckedCreateWithoutContestInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContestChallengeCreateOrConnectWithoutContestInputSchema),z.lazy(() => ContestChallengeCreateOrConnectWithoutContestInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ContestChallengeUpsertWithWhereUniqueWithoutContestInputSchema),z.lazy(() => ContestChallengeUpsertWithWhereUniqueWithoutContestInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => ContestChallengeWhereUniqueInputSchema),z.lazy(() => ContestChallengeWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ContestChallengeWhereUniqueInputSchema),z.lazy(() => ContestChallengeWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ContestChallengeWhereUniqueInputSchema),z.lazy(() => ContestChallengeWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ContestChallengeWhereUniqueInputSchema),z.lazy(() => ContestChallengeWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ContestChallengeUpdateWithWhereUniqueWithoutContestInputSchema),z.lazy(() => ContestChallengeUpdateWithWhereUniqueWithoutContestInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ContestChallengeUpdateManyWithWhereWithoutContestInputSchema),z.lazy(() => ContestChallengeUpdateManyWithWhereWithoutContestInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ContestChallengeScalarWhereInputSchema),z.lazy(() => ContestChallengeScalarWhereInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ContestChallengeUpdateManyWithoutContestNestedInput>;

export const ParticipantUpdateManyWithoutContestNestedInputSchema: z.ZodType<Prisma.ParticipantUpdateManyWithoutContestNestedInput> = z.object({
  create: z.union([ z.lazy(() => ParticipantCreateWithoutContestInputSchema),z.lazy(() => ParticipantCreateWithoutContestInputSchema).array(),z.lazy(() => ParticipantUncheckedCreateWithoutContestInputSchema),z.lazy(() => ParticipantUncheckedCreateWithoutContestInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ParticipantCreateOrConnectWithoutContestInputSchema),z.lazy(() => ParticipantCreateOrConnectWithoutContestInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ParticipantUpsertWithWhereUniqueWithoutContestInputSchema),z.lazy(() => ParticipantUpsertWithWhereUniqueWithoutContestInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ParticipantUpdateWithWhereUniqueWithoutContestInputSchema),z.lazy(() => ParticipantUpdateWithWhereUniqueWithoutContestInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ParticipantUpdateManyWithWhereWithoutContestInputSchema),z.lazy(() => ParticipantUpdateManyWithWhereWithoutContestInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ParticipantScalarWhereInputSchema),z.lazy(() => ParticipantScalarWhereInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ParticipantUpdateManyWithoutContestNestedInput>;

export const ContestChallengeUncheckedUpdateManyWithoutContestNestedInputSchema: z.ZodType<Prisma.ContestChallengeUncheckedUpdateManyWithoutContestNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContestChallengeCreateWithoutContestInputSchema),z.lazy(() => ContestChallengeCreateWithoutContestInputSchema).array(),z.lazy(() => ContestChallengeUncheckedCreateWithoutContestInputSchema),z.lazy(() => ContestChallengeUncheckedCreateWithoutContestInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContestChallengeCreateOrConnectWithoutContestInputSchema),z.lazy(() => ContestChallengeCreateOrConnectWithoutContestInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ContestChallengeUpsertWithWhereUniqueWithoutContestInputSchema),z.lazy(() => ContestChallengeUpsertWithWhereUniqueWithoutContestInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => ContestChallengeWhereUniqueInputSchema),z.lazy(() => ContestChallengeWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ContestChallengeWhereUniqueInputSchema),z.lazy(() => ContestChallengeWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ContestChallengeWhereUniqueInputSchema),z.lazy(() => ContestChallengeWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ContestChallengeWhereUniqueInputSchema),z.lazy(() => ContestChallengeWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ContestChallengeUpdateWithWhereUniqueWithoutContestInputSchema),z.lazy(() => ContestChallengeUpdateWithWhereUniqueWithoutContestInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ContestChallengeUpdateManyWithWhereWithoutContestInputSchema),z.lazy(() => ContestChallengeUpdateManyWithWhereWithoutContestInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ContestChallengeScalarWhereInputSchema),z.lazy(() => ContestChallengeScalarWhereInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ContestChallengeUncheckedUpdateManyWithoutContestNestedInput>;

export const ParticipantUncheckedUpdateManyWithoutContestNestedInputSchema: z.ZodType<Prisma.ParticipantUncheckedUpdateManyWithoutContestNestedInput> = z.object({
  create: z.union([ z.lazy(() => ParticipantCreateWithoutContestInputSchema),z.lazy(() => ParticipantCreateWithoutContestInputSchema).array(),z.lazy(() => ParticipantUncheckedCreateWithoutContestInputSchema),z.lazy(() => ParticipantUncheckedCreateWithoutContestInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ParticipantCreateOrConnectWithoutContestInputSchema),z.lazy(() => ParticipantCreateOrConnectWithoutContestInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ParticipantUpsertWithWhereUniqueWithoutContestInputSchema),z.lazy(() => ParticipantUpsertWithWhereUniqueWithoutContestInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ParticipantWhereUniqueInputSchema),z.lazy(() => ParticipantWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ParticipantUpdateWithWhereUniqueWithoutContestInputSchema),z.lazy(() => ParticipantUpdateWithWhereUniqueWithoutContestInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ParticipantUpdateManyWithWhereWithoutContestInputSchema),z.lazy(() => ParticipantUpdateManyWithWhereWithoutContestInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ParticipantScalarWhereInputSchema),z.lazy(() => ParticipantScalarWhereInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ParticipantUncheckedUpdateManyWithoutContestNestedInput>;

export const ChallengeCreateNestedOneWithoutContestsInputSchema: z.ZodType<Prisma.ChallengeCreateNestedOneWithoutContestsInput> = z.object({
  create: z.union([ z.lazy(() => ChallengeCreateWithoutContestsInputSchema),z.lazy(() => ChallengeUncheckedCreateWithoutContestsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ChallengeCreateOrConnectWithoutContestsInputSchema).optional(),
  connect: z.lazy(() => ChallengeWhereUniqueInputSchema).optional()
}).strict() as z.ZodType<Prisma.ChallengeCreateNestedOneWithoutContestsInput>;

export const ContestCreateNestedOneWithoutChallengesInputSchema: z.ZodType<Prisma.ContestCreateNestedOneWithoutChallengesInput> = z.object({
  create: z.union([ z.lazy(() => ContestCreateWithoutChallengesInputSchema),z.lazy(() => ContestUncheckedCreateWithoutChallengesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ContestCreateOrConnectWithoutChallengesInputSchema).optional(),
  connect: z.lazy(() => ContestWhereUniqueInputSchema).optional()
}).strict() as z.ZodType<Prisma.ContestCreateNestedOneWithoutChallengesInput>;

export const SubmissionCreateNestedManyWithoutChallengeInputSchema: z.ZodType<Prisma.SubmissionCreateNestedManyWithoutChallengeInput> = z.object({
  create: z.union([ z.lazy(() => SubmissionCreateWithoutChallengeInputSchema),z.lazy(() => SubmissionCreateWithoutChallengeInputSchema).array(),z.lazy(() => SubmissionUncheckedCreateWithoutChallengeInputSchema),z.lazy(() => SubmissionUncheckedCreateWithoutChallengeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SubmissionCreateOrConnectWithoutChallengeInputSchema),z.lazy(() => SubmissionCreateOrConnectWithoutChallengeInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.SubmissionCreateNestedManyWithoutChallengeInput>;

export const SubmissionUncheckedCreateNestedManyWithoutChallengeInputSchema: z.ZodType<Prisma.SubmissionUncheckedCreateNestedManyWithoutChallengeInput> = z.object({
  create: z.union([ z.lazy(() => SubmissionCreateWithoutChallengeInputSchema),z.lazy(() => SubmissionCreateWithoutChallengeInputSchema).array(),z.lazy(() => SubmissionUncheckedCreateWithoutChallengeInputSchema),z.lazy(() => SubmissionUncheckedCreateWithoutChallengeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SubmissionCreateOrConnectWithoutChallengeInputSchema),z.lazy(() => SubmissionCreateOrConnectWithoutChallengeInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.SubmissionUncheckedCreateNestedManyWithoutChallengeInput>;

export const ChallengeUpdateOneRequiredWithoutContestsNestedInputSchema: z.ZodType<Prisma.ChallengeUpdateOneRequiredWithoutContestsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ChallengeCreateWithoutContestsInputSchema),z.lazy(() => ChallengeUncheckedCreateWithoutContestsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ChallengeCreateOrConnectWithoutContestsInputSchema).optional(),
  upsert: z.lazy(() => ChallengeUpsertWithoutContestsInputSchema).optional(),
  connect: z.lazy(() => ChallengeWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ChallengeUpdateToOneWithWhereWithoutContestsInputSchema),z.lazy(() => ChallengeUpdateWithoutContestsInputSchema),z.lazy(() => ChallengeUncheckedUpdateWithoutContestsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ChallengeUpdateOneRequiredWithoutContestsNestedInput>;

export const ContestUpdateOneRequiredWithoutChallengesNestedInputSchema: z.ZodType<Prisma.ContestUpdateOneRequiredWithoutChallengesNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContestCreateWithoutChallengesInputSchema),z.lazy(() => ContestUncheckedCreateWithoutChallengesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ContestCreateOrConnectWithoutChallengesInputSchema).optional(),
  upsert: z.lazy(() => ContestUpsertWithoutChallengesInputSchema).optional(),
  connect: z.lazy(() => ContestWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ContestUpdateToOneWithWhereWithoutChallengesInputSchema),z.lazy(() => ContestUpdateWithoutChallengesInputSchema),z.lazy(() => ContestUncheckedUpdateWithoutChallengesInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ContestUpdateOneRequiredWithoutChallengesNestedInput>;

export const SubmissionUpdateManyWithoutChallengeNestedInputSchema: z.ZodType<Prisma.SubmissionUpdateManyWithoutChallengeNestedInput> = z.object({
  create: z.union([ z.lazy(() => SubmissionCreateWithoutChallengeInputSchema),z.lazy(() => SubmissionCreateWithoutChallengeInputSchema).array(),z.lazy(() => SubmissionUncheckedCreateWithoutChallengeInputSchema),z.lazy(() => SubmissionUncheckedCreateWithoutChallengeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SubmissionCreateOrConnectWithoutChallengeInputSchema),z.lazy(() => SubmissionCreateOrConnectWithoutChallengeInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SubmissionUpsertWithWhereUniqueWithoutChallengeInputSchema),z.lazy(() => SubmissionUpsertWithWhereUniqueWithoutChallengeInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SubmissionUpdateWithWhereUniqueWithoutChallengeInputSchema),z.lazy(() => SubmissionUpdateWithWhereUniqueWithoutChallengeInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SubmissionUpdateManyWithWhereWithoutChallengeInputSchema),z.lazy(() => SubmissionUpdateManyWithWhereWithoutChallengeInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SubmissionScalarWhereInputSchema),z.lazy(() => SubmissionScalarWhereInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.SubmissionUpdateManyWithoutChallengeNestedInput>;

export const SubmissionUncheckedUpdateManyWithoutChallengeNestedInputSchema: z.ZodType<Prisma.SubmissionUncheckedUpdateManyWithoutChallengeNestedInput> = z.object({
  create: z.union([ z.lazy(() => SubmissionCreateWithoutChallengeInputSchema),z.lazy(() => SubmissionCreateWithoutChallengeInputSchema).array(),z.lazy(() => SubmissionUncheckedCreateWithoutChallengeInputSchema),z.lazy(() => SubmissionUncheckedCreateWithoutChallengeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => SubmissionCreateOrConnectWithoutChallengeInputSchema),z.lazy(() => SubmissionCreateOrConnectWithoutChallengeInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => SubmissionUpsertWithWhereUniqueWithoutChallengeInputSchema),z.lazy(() => SubmissionUpsertWithWhereUniqueWithoutChallengeInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => SubmissionWhereUniqueInputSchema),z.lazy(() => SubmissionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => SubmissionUpdateWithWhereUniqueWithoutChallengeInputSchema),z.lazy(() => SubmissionUpdateWithWhereUniqueWithoutChallengeInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => SubmissionUpdateManyWithWhereWithoutChallengeInputSchema),z.lazy(() => SubmissionUpdateManyWithWhereWithoutChallengeInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => SubmissionScalarWhereInputSchema),z.lazy(() => SubmissionScalarWhereInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.SubmissionUncheckedUpdateManyWithoutChallengeNestedInput>;

export const TaskCreateNestedManyWithoutChallengeInputSchema: z.ZodType<Prisma.TaskCreateNestedManyWithoutChallengeInput> = z.object({
  create: z.union([ z.lazy(() => TaskCreateWithoutChallengeInputSchema),z.lazy(() => TaskCreateWithoutChallengeInputSchema).array(),z.lazy(() => TaskUncheckedCreateWithoutChallengeInputSchema),z.lazy(() => TaskUncheckedCreateWithoutChallengeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TaskCreateOrConnectWithoutChallengeInputSchema),z.lazy(() => TaskCreateOrConnectWithoutChallengeInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TaskWhereUniqueInputSchema),z.lazy(() => TaskWhereUniqueInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.TaskCreateNestedManyWithoutChallengeInput>;

export const ContestChallengeCreateNestedManyWithoutChallengeInputSchema: z.ZodType<Prisma.ContestChallengeCreateNestedManyWithoutChallengeInput> = z.object({
  create: z.union([ z.lazy(() => ContestChallengeCreateWithoutChallengeInputSchema),z.lazy(() => ContestChallengeCreateWithoutChallengeInputSchema).array(),z.lazy(() => ContestChallengeUncheckedCreateWithoutChallengeInputSchema),z.lazy(() => ContestChallengeUncheckedCreateWithoutChallengeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContestChallengeCreateOrConnectWithoutChallengeInputSchema),z.lazy(() => ContestChallengeCreateOrConnectWithoutChallengeInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ContestChallengeWhereUniqueInputSchema),z.lazy(() => ContestChallengeWhereUniqueInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ContestChallengeCreateNestedManyWithoutChallengeInput>;

export const TestCreateNestedManyWithoutChallengeInputSchema: z.ZodType<Prisma.TestCreateNestedManyWithoutChallengeInput> = z.object({
  create: z.union([ z.lazy(() => TestCreateWithoutChallengeInputSchema),z.lazy(() => TestCreateWithoutChallengeInputSchema).array(),z.lazy(() => TestUncheckedCreateWithoutChallengeInputSchema),z.lazy(() => TestUncheckedCreateWithoutChallengeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TestCreateOrConnectWithoutChallengeInputSchema),z.lazy(() => TestCreateOrConnectWithoutChallengeInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.TestCreateNestedManyWithoutChallengeInput>;

export const TaskUncheckedCreateNestedManyWithoutChallengeInputSchema: z.ZodType<Prisma.TaskUncheckedCreateNestedManyWithoutChallengeInput> = z.object({
  create: z.union([ z.lazy(() => TaskCreateWithoutChallengeInputSchema),z.lazy(() => TaskCreateWithoutChallengeInputSchema).array(),z.lazy(() => TaskUncheckedCreateWithoutChallengeInputSchema),z.lazy(() => TaskUncheckedCreateWithoutChallengeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TaskCreateOrConnectWithoutChallengeInputSchema),z.lazy(() => TaskCreateOrConnectWithoutChallengeInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TaskWhereUniqueInputSchema),z.lazy(() => TaskWhereUniqueInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.TaskUncheckedCreateNestedManyWithoutChallengeInput>;

export const ContestChallengeUncheckedCreateNestedManyWithoutChallengeInputSchema: z.ZodType<Prisma.ContestChallengeUncheckedCreateNestedManyWithoutChallengeInput> = z.object({
  create: z.union([ z.lazy(() => ContestChallengeCreateWithoutChallengeInputSchema),z.lazy(() => ContestChallengeCreateWithoutChallengeInputSchema).array(),z.lazy(() => ContestChallengeUncheckedCreateWithoutChallengeInputSchema),z.lazy(() => ContestChallengeUncheckedCreateWithoutChallengeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContestChallengeCreateOrConnectWithoutChallengeInputSchema),z.lazy(() => ContestChallengeCreateOrConnectWithoutChallengeInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ContestChallengeWhereUniqueInputSchema),z.lazy(() => ContestChallengeWhereUniqueInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ContestChallengeUncheckedCreateNestedManyWithoutChallengeInput>;

export const TestUncheckedCreateNestedManyWithoutChallengeInputSchema: z.ZodType<Prisma.TestUncheckedCreateNestedManyWithoutChallengeInput> = z.object({
  create: z.union([ z.lazy(() => TestCreateWithoutChallengeInputSchema),z.lazy(() => TestCreateWithoutChallengeInputSchema).array(),z.lazy(() => TestUncheckedCreateWithoutChallengeInputSchema),z.lazy(() => TestUncheckedCreateWithoutChallengeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TestCreateOrConnectWithoutChallengeInputSchema),z.lazy(() => TestCreateOrConnectWithoutChallengeInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.TestUncheckedCreateNestedManyWithoutChallengeInput>;

export const TaskUpdateManyWithoutChallengeNestedInputSchema: z.ZodType<Prisma.TaskUpdateManyWithoutChallengeNestedInput> = z.object({
  create: z.union([ z.lazy(() => TaskCreateWithoutChallengeInputSchema),z.lazy(() => TaskCreateWithoutChallengeInputSchema).array(),z.lazy(() => TaskUncheckedCreateWithoutChallengeInputSchema),z.lazy(() => TaskUncheckedCreateWithoutChallengeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TaskCreateOrConnectWithoutChallengeInputSchema),z.lazy(() => TaskCreateOrConnectWithoutChallengeInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TaskUpsertWithWhereUniqueWithoutChallengeInputSchema),z.lazy(() => TaskUpsertWithWhereUniqueWithoutChallengeInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => TaskWhereUniqueInputSchema),z.lazy(() => TaskWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TaskWhereUniqueInputSchema),z.lazy(() => TaskWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TaskWhereUniqueInputSchema),z.lazy(() => TaskWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TaskWhereUniqueInputSchema),z.lazy(() => TaskWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TaskUpdateWithWhereUniqueWithoutChallengeInputSchema),z.lazy(() => TaskUpdateWithWhereUniqueWithoutChallengeInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TaskUpdateManyWithWhereWithoutChallengeInputSchema),z.lazy(() => TaskUpdateManyWithWhereWithoutChallengeInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TaskScalarWhereInputSchema),z.lazy(() => TaskScalarWhereInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.TaskUpdateManyWithoutChallengeNestedInput>;

export const ContestChallengeUpdateManyWithoutChallengeNestedInputSchema: z.ZodType<Prisma.ContestChallengeUpdateManyWithoutChallengeNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContestChallengeCreateWithoutChallengeInputSchema),z.lazy(() => ContestChallengeCreateWithoutChallengeInputSchema).array(),z.lazy(() => ContestChallengeUncheckedCreateWithoutChallengeInputSchema),z.lazy(() => ContestChallengeUncheckedCreateWithoutChallengeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContestChallengeCreateOrConnectWithoutChallengeInputSchema),z.lazy(() => ContestChallengeCreateOrConnectWithoutChallengeInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ContestChallengeUpsertWithWhereUniqueWithoutChallengeInputSchema),z.lazy(() => ContestChallengeUpsertWithWhereUniqueWithoutChallengeInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => ContestChallengeWhereUniqueInputSchema),z.lazy(() => ContestChallengeWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ContestChallengeWhereUniqueInputSchema),z.lazy(() => ContestChallengeWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ContestChallengeWhereUniqueInputSchema),z.lazy(() => ContestChallengeWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ContestChallengeWhereUniqueInputSchema),z.lazy(() => ContestChallengeWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ContestChallengeUpdateWithWhereUniqueWithoutChallengeInputSchema),z.lazy(() => ContestChallengeUpdateWithWhereUniqueWithoutChallengeInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ContestChallengeUpdateManyWithWhereWithoutChallengeInputSchema),z.lazy(() => ContestChallengeUpdateManyWithWhereWithoutChallengeInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ContestChallengeScalarWhereInputSchema),z.lazy(() => ContestChallengeScalarWhereInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ContestChallengeUpdateManyWithoutChallengeNestedInput>;

export const TestUpdateManyWithoutChallengeNestedInputSchema: z.ZodType<Prisma.TestUpdateManyWithoutChallengeNestedInput> = z.object({
  create: z.union([ z.lazy(() => TestCreateWithoutChallengeInputSchema),z.lazy(() => TestCreateWithoutChallengeInputSchema).array(),z.lazy(() => TestUncheckedCreateWithoutChallengeInputSchema),z.lazy(() => TestUncheckedCreateWithoutChallengeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TestCreateOrConnectWithoutChallengeInputSchema),z.lazy(() => TestCreateOrConnectWithoutChallengeInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TestUpsertWithWhereUniqueWithoutChallengeInputSchema),z.lazy(() => TestUpsertWithWhereUniqueWithoutChallengeInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TestUpdateWithWhereUniqueWithoutChallengeInputSchema),z.lazy(() => TestUpdateWithWhereUniqueWithoutChallengeInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TestUpdateManyWithWhereWithoutChallengeInputSchema),z.lazy(() => TestUpdateManyWithWhereWithoutChallengeInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TestScalarWhereInputSchema),z.lazy(() => TestScalarWhereInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.TestUpdateManyWithoutChallengeNestedInput>;

export const TaskUncheckedUpdateManyWithoutChallengeNestedInputSchema: z.ZodType<Prisma.TaskUncheckedUpdateManyWithoutChallengeNestedInput> = z.object({
  create: z.union([ z.lazy(() => TaskCreateWithoutChallengeInputSchema),z.lazy(() => TaskCreateWithoutChallengeInputSchema).array(),z.lazy(() => TaskUncheckedCreateWithoutChallengeInputSchema),z.lazy(() => TaskUncheckedCreateWithoutChallengeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TaskCreateOrConnectWithoutChallengeInputSchema),z.lazy(() => TaskCreateOrConnectWithoutChallengeInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TaskUpsertWithWhereUniqueWithoutChallengeInputSchema),z.lazy(() => TaskUpsertWithWhereUniqueWithoutChallengeInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => TaskWhereUniqueInputSchema),z.lazy(() => TaskWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TaskWhereUniqueInputSchema),z.lazy(() => TaskWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TaskWhereUniqueInputSchema),z.lazy(() => TaskWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TaskWhereUniqueInputSchema),z.lazy(() => TaskWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TaskUpdateWithWhereUniqueWithoutChallengeInputSchema),z.lazy(() => TaskUpdateWithWhereUniqueWithoutChallengeInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TaskUpdateManyWithWhereWithoutChallengeInputSchema),z.lazy(() => TaskUpdateManyWithWhereWithoutChallengeInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TaskScalarWhereInputSchema),z.lazy(() => TaskScalarWhereInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.TaskUncheckedUpdateManyWithoutChallengeNestedInput>;

export const ContestChallengeUncheckedUpdateManyWithoutChallengeNestedInputSchema: z.ZodType<Prisma.ContestChallengeUncheckedUpdateManyWithoutChallengeNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContestChallengeCreateWithoutChallengeInputSchema),z.lazy(() => ContestChallengeCreateWithoutChallengeInputSchema).array(),z.lazy(() => ContestChallengeUncheckedCreateWithoutChallengeInputSchema),z.lazy(() => ContestChallengeUncheckedCreateWithoutChallengeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContestChallengeCreateOrConnectWithoutChallengeInputSchema),z.lazy(() => ContestChallengeCreateOrConnectWithoutChallengeInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ContestChallengeUpsertWithWhereUniqueWithoutChallengeInputSchema),z.lazy(() => ContestChallengeUpsertWithWhereUniqueWithoutChallengeInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => ContestChallengeWhereUniqueInputSchema),z.lazy(() => ContestChallengeWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ContestChallengeWhereUniqueInputSchema),z.lazy(() => ContestChallengeWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ContestChallengeWhereUniqueInputSchema),z.lazy(() => ContestChallengeWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ContestChallengeWhereUniqueInputSchema),z.lazy(() => ContestChallengeWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ContestChallengeUpdateWithWhereUniqueWithoutChallengeInputSchema),z.lazy(() => ContestChallengeUpdateWithWhereUniqueWithoutChallengeInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ContestChallengeUpdateManyWithWhereWithoutChallengeInputSchema),z.lazy(() => ContestChallengeUpdateManyWithWhereWithoutChallengeInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ContestChallengeScalarWhereInputSchema),z.lazy(() => ContestChallengeScalarWhereInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ContestChallengeUncheckedUpdateManyWithoutChallengeNestedInput>;

export const TestUncheckedUpdateManyWithoutChallengeNestedInputSchema: z.ZodType<Prisma.TestUncheckedUpdateManyWithoutChallengeNestedInput> = z.object({
  create: z.union([ z.lazy(() => TestCreateWithoutChallengeInputSchema),z.lazy(() => TestCreateWithoutChallengeInputSchema).array(),z.lazy(() => TestUncheckedCreateWithoutChallengeInputSchema),z.lazy(() => TestUncheckedCreateWithoutChallengeInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TestCreateOrConnectWithoutChallengeInputSchema),z.lazy(() => TestCreateOrConnectWithoutChallengeInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TestUpsertWithWhereUniqueWithoutChallengeInputSchema),z.lazy(() => TestUpsertWithWhereUniqueWithoutChallengeInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TestUpdateWithWhereUniqueWithoutChallengeInputSchema),z.lazy(() => TestUpdateWithWhereUniqueWithoutChallengeInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TestUpdateManyWithWhereWithoutChallengeInputSchema),z.lazy(() => TestUpdateManyWithWhereWithoutChallengeInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TestScalarWhereInputSchema),z.lazy(() => TestScalarWhereInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.TestUncheckedUpdateManyWithoutChallengeNestedInput>;

export const ChallengeCreateNestedOneWithoutTasksInputSchema: z.ZodType<Prisma.ChallengeCreateNestedOneWithoutTasksInput> = z.object({
  create: z.union([ z.lazy(() => ChallengeCreateWithoutTasksInputSchema),z.lazy(() => ChallengeUncheckedCreateWithoutTasksInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ChallengeCreateOrConnectWithoutTasksInputSchema).optional(),
  connect: z.lazy(() => ChallengeWhereUniqueInputSchema).optional()
}).strict() as z.ZodType<Prisma.ChallengeCreateNestedOneWithoutTasksInput>;

export const TestCreateNestedManyWithoutTaskInputSchema: z.ZodType<Prisma.TestCreateNestedManyWithoutTaskInput> = z.object({
  create: z.union([ z.lazy(() => TestCreateWithoutTaskInputSchema),z.lazy(() => TestCreateWithoutTaskInputSchema).array(),z.lazy(() => TestUncheckedCreateWithoutTaskInputSchema),z.lazy(() => TestUncheckedCreateWithoutTaskInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TestCreateOrConnectWithoutTaskInputSchema),z.lazy(() => TestCreateOrConnectWithoutTaskInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.TestCreateNestedManyWithoutTaskInput>;

export const ResultCreateNestedManyWithoutTaskInputSchema: z.ZodType<Prisma.ResultCreateNestedManyWithoutTaskInput> = z.object({
  create: z.union([ z.lazy(() => ResultCreateWithoutTaskInputSchema),z.lazy(() => ResultCreateWithoutTaskInputSchema).array(),z.lazy(() => ResultUncheckedCreateWithoutTaskInputSchema),z.lazy(() => ResultUncheckedCreateWithoutTaskInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResultCreateOrConnectWithoutTaskInputSchema),z.lazy(() => ResultCreateOrConnectWithoutTaskInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResultWhereUniqueInputSchema),z.lazy(() => ResultWhereUniqueInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ResultCreateNestedManyWithoutTaskInput>;

export const TestUncheckedCreateNestedManyWithoutTaskInputSchema: z.ZodType<Prisma.TestUncheckedCreateNestedManyWithoutTaskInput> = z.object({
  create: z.union([ z.lazy(() => TestCreateWithoutTaskInputSchema),z.lazy(() => TestCreateWithoutTaskInputSchema).array(),z.lazy(() => TestUncheckedCreateWithoutTaskInputSchema),z.lazy(() => TestUncheckedCreateWithoutTaskInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TestCreateOrConnectWithoutTaskInputSchema),z.lazy(() => TestCreateOrConnectWithoutTaskInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.TestUncheckedCreateNestedManyWithoutTaskInput>;

export const ResultUncheckedCreateNestedManyWithoutTaskInputSchema: z.ZodType<Prisma.ResultUncheckedCreateNestedManyWithoutTaskInput> = z.object({
  create: z.union([ z.lazy(() => ResultCreateWithoutTaskInputSchema),z.lazy(() => ResultCreateWithoutTaskInputSchema).array(),z.lazy(() => ResultUncheckedCreateWithoutTaskInputSchema),z.lazy(() => ResultUncheckedCreateWithoutTaskInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResultCreateOrConnectWithoutTaskInputSchema),z.lazy(() => ResultCreateOrConnectWithoutTaskInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResultWhereUniqueInputSchema),z.lazy(() => ResultWhereUniqueInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ResultUncheckedCreateNestedManyWithoutTaskInput>;

export const ChallengeUpdateOneRequiredWithoutTasksNestedInputSchema: z.ZodType<Prisma.ChallengeUpdateOneRequiredWithoutTasksNestedInput> = z.object({
  create: z.union([ z.lazy(() => ChallengeCreateWithoutTasksInputSchema),z.lazy(() => ChallengeUncheckedCreateWithoutTasksInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ChallengeCreateOrConnectWithoutTasksInputSchema).optional(),
  upsert: z.lazy(() => ChallengeUpsertWithoutTasksInputSchema).optional(),
  connect: z.lazy(() => ChallengeWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ChallengeUpdateToOneWithWhereWithoutTasksInputSchema),z.lazy(() => ChallengeUpdateWithoutTasksInputSchema),z.lazy(() => ChallengeUncheckedUpdateWithoutTasksInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ChallengeUpdateOneRequiredWithoutTasksNestedInput>;

export const TestUpdateManyWithoutTaskNestedInputSchema: z.ZodType<Prisma.TestUpdateManyWithoutTaskNestedInput> = z.object({
  create: z.union([ z.lazy(() => TestCreateWithoutTaskInputSchema),z.lazy(() => TestCreateWithoutTaskInputSchema).array(),z.lazy(() => TestUncheckedCreateWithoutTaskInputSchema),z.lazy(() => TestUncheckedCreateWithoutTaskInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TestCreateOrConnectWithoutTaskInputSchema),z.lazy(() => TestCreateOrConnectWithoutTaskInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TestUpsertWithWhereUniqueWithoutTaskInputSchema),z.lazy(() => TestUpsertWithWhereUniqueWithoutTaskInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TestUpdateWithWhereUniqueWithoutTaskInputSchema),z.lazy(() => TestUpdateWithWhereUniqueWithoutTaskInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TestUpdateManyWithWhereWithoutTaskInputSchema),z.lazy(() => TestUpdateManyWithWhereWithoutTaskInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TestScalarWhereInputSchema),z.lazy(() => TestScalarWhereInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.TestUpdateManyWithoutTaskNestedInput>;

export const ResultUpdateManyWithoutTaskNestedInputSchema: z.ZodType<Prisma.ResultUpdateManyWithoutTaskNestedInput> = z.object({
  create: z.union([ z.lazy(() => ResultCreateWithoutTaskInputSchema),z.lazy(() => ResultCreateWithoutTaskInputSchema).array(),z.lazy(() => ResultUncheckedCreateWithoutTaskInputSchema),z.lazy(() => ResultUncheckedCreateWithoutTaskInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResultCreateOrConnectWithoutTaskInputSchema),z.lazy(() => ResultCreateOrConnectWithoutTaskInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ResultUpsertWithWhereUniqueWithoutTaskInputSchema),z.lazy(() => ResultUpsertWithWhereUniqueWithoutTaskInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => ResultWhereUniqueInputSchema),z.lazy(() => ResultWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ResultWhereUniqueInputSchema),z.lazy(() => ResultWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ResultWhereUniqueInputSchema),z.lazy(() => ResultWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResultWhereUniqueInputSchema),z.lazy(() => ResultWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ResultUpdateWithWhereUniqueWithoutTaskInputSchema),z.lazy(() => ResultUpdateWithWhereUniqueWithoutTaskInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ResultUpdateManyWithWhereWithoutTaskInputSchema),z.lazy(() => ResultUpdateManyWithWhereWithoutTaskInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ResultScalarWhereInputSchema),z.lazy(() => ResultScalarWhereInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ResultUpdateManyWithoutTaskNestedInput>;

export const TestUncheckedUpdateManyWithoutTaskNestedInputSchema: z.ZodType<Prisma.TestUncheckedUpdateManyWithoutTaskNestedInput> = z.object({
  create: z.union([ z.lazy(() => TestCreateWithoutTaskInputSchema),z.lazy(() => TestCreateWithoutTaskInputSchema).array(),z.lazy(() => TestUncheckedCreateWithoutTaskInputSchema),z.lazy(() => TestUncheckedCreateWithoutTaskInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TestCreateOrConnectWithoutTaskInputSchema),z.lazy(() => TestCreateOrConnectWithoutTaskInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TestUpsertWithWhereUniqueWithoutTaskInputSchema),z.lazy(() => TestUpsertWithWhereUniqueWithoutTaskInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TestWhereUniqueInputSchema),z.lazy(() => TestWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TestUpdateWithWhereUniqueWithoutTaskInputSchema),z.lazy(() => TestUpdateWithWhereUniqueWithoutTaskInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TestUpdateManyWithWhereWithoutTaskInputSchema),z.lazy(() => TestUpdateManyWithWhereWithoutTaskInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TestScalarWhereInputSchema),z.lazy(() => TestScalarWhereInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.TestUncheckedUpdateManyWithoutTaskNestedInput>;

export const ResultUncheckedUpdateManyWithoutTaskNestedInputSchema: z.ZodType<Prisma.ResultUncheckedUpdateManyWithoutTaskNestedInput> = z.object({
  create: z.union([ z.lazy(() => ResultCreateWithoutTaskInputSchema),z.lazy(() => ResultCreateWithoutTaskInputSchema).array(),z.lazy(() => ResultUncheckedCreateWithoutTaskInputSchema),z.lazy(() => ResultUncheckedCreateWithoutTaskInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResultCreateOrConnectWithoutTaskInputSchema),z.lazy(() => ResultCreateOrConnectWithoutTaskInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ResultUpsertWithWhereUniqueWithoutTaskInputSchema),z.lazy(() => ResultUpsertWithWhereUniqueWithoutTaskInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => ResultWhereUniqueInputSchema),z.lazy(() => ResultWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ResultWhereUniqueInputSchema),z.lazy(() => ResultWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ResultWhereUniqueInputSchema),z.lazy(() => ResultWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResultWhereUniqueInputSchema),z.lazy(() => ResultWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ResultUpdateWithWhereUniqueWithoutTaskInputSchema),z.lazy(() => ResultUpdateWithWhereUniqueWithoutTaskInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ResultUpdateManyWithWhereWithoutTaskInputSchema),z.lazy(() => ResultUpdateManyWithWhereWithoutTaskInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ResultScalarWhereInputSchema),z.lazy(() => ResultScalarWhereInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ResultUncheckedUpdateManyWithoutTaskNestedInput>;

export const TaskCreateNestedOneWithoutTestsInputSchema: z.ZodType<Prisma.TaskCreateNestedOneWithoutTestsInput> = z.object({
  create: z.union([ z.lazy(() => TaskCreateWithoutTestsInputSchema),z.lazy(() => TaskUncheckedCreateWithoutTestsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TaskCreateOrConnectWithoutTestsInputSchema).optional(),
  connect: z.lazy(() => TaskWhereUniqueInputSchema).optional()
}).strict() as z.ZodType<Prisma.TaskCreateNestedOneWithoutTestsInput>;

export const ChallengeCreateNestedOneWithoutTestsInputSchema: z.ZodType<Prisma.ChallengeCreateNestedOneWithoutTestsInput> = z.object({
  create: z.union([ z.lazy(() => ChallengeCreateWithoutTestsInputSchema),z.lazy(() => ChallengeUncheckedCreateWithoutTestsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ChallengeCreateOrConnectWithoutTestsInputSchema).optional(),
  connect: z.lazy(() => ChallengeWhereUniqueInputSchema).optional()
}).strict() as z.ZodType<Prisma.ChallengeCreateNestedOneWithoutTestsInput>;

export const ResultCreateNestedManyWithoutTestInputSchema: z.ZodType<Prisma.ResultCreateNestedManyWithoutTestInput> = z.object({
  create: z.union([ z.lazy(() => ResultCreateWithoutTestInputSchema),z.lazy(() => ResultCreateWithoutTestInputSchema).array(),z.lazy(() => ResultUncheckedCreateWithoutTestInputSchema),z.lazy(() => ResultUncheckedCreateWithoutTestInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResultCreateOrConnectWithoutTestInputSchema),z.lazy(() => ResultCreateOrConnectWithoutTestInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResultWhereUniqueInputSchema),z.lazy(() => ResultWhereUniqueInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ResultCreateNestedManyWithoutTestInput>;

export const ResultUncheckedCreateNestedManyWithoutTestInputSchema: z.ZodType<Prisma.ResultUncheckedCreateNestedManyWithoutTestInput> = z.object({
  create: z.union([ z.lazy(() => ResultCreateWithoutTestInputSchema),z.lazy(() => ResultCreateWithoutTestInputSchema).array(),z.lazy(() => ResultUncheckedCreateWithoutTestInputSchema),z.lazy(() => ResultUncheckedCreateWithoutTestInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResultCreateOrConnectWithoutTestInputSchema),z.lazy(() => ResultCreateOrConnectWithoutTestInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResultWhereUniqueInputSchema),z.lazy(() => ResultWhereUniqueInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ResultUncheckedCreateNestedManyWithoutTestInput>;

export const TaskUpdateOneRequiredWithoutTestsNestedInputSchema: z.ZodType<Prisma.TaskUpdateOneRequiredWithoutTestsNestedInput> = z.object({
  create: z.union([ z.lazy(() => TaskCreateWithoutTestsInputSchema),z.lazy(() => TaskUncheckedCreateWithoutTestsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TaskCreateOrConnectWithoutTestsInputSchema).optional(),
  upsert: z.lazy(() => TaskUpsertWithoutTestsInputSchema).optional(),
  connect: z.lazy(() => TaskWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => TaskUpdateToOneWithWhereWithoutTestsInputSchema),z.lazy(() => TaskUpdateWithoutTestsInputSchema),z.lazy(() => TaskUncheckedUpdateWithoutTestsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.TaskUpdateOneRequiredWithoutTestsNestedInput>;

export const ChallengeUpdateOneRequiredWithoutTestsNestedInputSchema: z.ZodType<Prisma.ChallengeUpdateOneRequiredWithoutTestsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ChallengeCreateWithoutTestsInputSchema),z.lazy(() => ChallengeUncheckedCreateWithoutTestsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ChallengeCreateOrConnectWithoutTestsInputSchema).optional(),
  upsert: z.lazy(() => ChallengeUpsertWithoutTestsInputSchema).optional(),
  connect: z.lazy(() => ChallengeWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ChallengeUpdateToOneWithWhereWithoutTestsInputSchema),z.lazy(() => ChallengeUpdateWithoutTestsInputSchema),z.lazy(() => ChallengeUncheckedUpdateWithoutTestsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ChallengeUpdateOneRequiredWithoutTestsNestedInput>;

export const ResultUpdateManyWithoutTestNestedInputSchema: z.ZodType<Prisma.ResultUpdateManyWithoutTestNestedInput> = z.object({
  create: z.union([ z.lazy(() => ResultCreateWithoutTestInputSchema),z.lazy(() => ResultCreateWithoutTestInputSchema).array(),z.lazy(() => ResultUncheckedCreateWithoutTestInputSchema),z.lazy(() => ResultUncheckedCreateWithoutTestInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResultCreateOrConnectWithoutTestInputSchema),z.lazy(() => ResultCreateOrConnectWithoutTestInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ResultUpsertWithWhereUniqueWithoutTestInputSchema),z.lazy(() => ResultUpsertWithWhereUniqueWithoutTestInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => ResultWhereUniqueInputSchema),z.lazy(() => ResultWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ResultWhereUniqueInputSchema),z.lazy(() => ResultWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ResultWhereUniqueInputSchema),z.lazy(() => ResultWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResultWhereUniqueInputSchema),z.lazy(() => ResultWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ResultUpdateWithWhereUniqueWithoutTestInputSchema),z.lazy(() => ResultUpdateWithWhereUniqueWithoutTestInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ResultUpdateManyWithWhereWithoutTestInputSchema),z.lazy(() => ResultUpdateManyWithWhereWithoutTestInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ResultScalarWhereInputSchema),z.lazy(() => ResultScalarWhereInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ResultUpdateManyWithoutTestNestedInput>;

export const ResultUncheckedUpdateManyWithoutTestNestedInputSchema: z.ZodType<Prisma.ResultUncheckedUpdateManyWithoutTestNestedInput> = z.object({
  create: z.union([ z.lazy(() => ResultCreateWithoutTestInputSchema),z.lazy(() => ResultCreateWithoutTestInputSchema).array(),z.lazy(() => ResultUncheckedCreateWithoutTestInputSchema),z.lazy(() => ResultUncheckedCreateWithoutTestInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ResultCreateOrConnectWithoutTestInputSchema),z.lazy(() => ResultCreateOrConnectWithoutTestInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ResultUpsertWithWhereUniqueWithoutTestInputSchema),z.lazy(() => ResultUpsertWithWhereUniqueWithoutTestInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => ResultWhereUniqueInputSchema),z.lazy(() => ResultWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ResultWhereUniqueInputSchema),z.lazy(() => ResultWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ResultWhereUniqueInputSchema),z.lazy(() => ResultWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ResultWhereUniqueInputSchema),z.lazy(() => ResultWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ResultUpdateWithWhereUniqueWithoutTestInputSchema),z.lazy(() => ResultUpdateWithWhereUniqueWithoutTestInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ResultUpdateManyWithWhereWithoutTestInputSchema),z.lazy(() => ResultUpdateManyWithWhereWithoutTestInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ResultScalarWhereInputSchema),z.lazy(() => ResultScalarWhereInputSchema).array() ]).optional(),
}).strict() as z.ZodType<Prisma.ResultUncheckedUpdateManyWithoutTestNestedInput>;

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.NestedIntFilter>;

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.NestedStringFilter>;

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.NestedBoolFilter>;

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict() as z.ZodType<Prisma.NestedIntWithAggregatesFilter>;

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.NestedFloatFilter>;

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict() as z.ZodType<Prisma.NestedStringWithAggregatesFilter>;

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict() as z.ZodType<Prisma.NestedBoolWithAggregatesFilter>;

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict() as z.ZodType<Prisma.NestedIntNullableFilter>;

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.NestedDateTimeFilter>;

export const NestedIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict() as z.ZodType<Prisma.NestedIntNullableWithAggregatesFilter>;

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict() as z.ZodType<Prisma.NestedFloatNullableFilter>;

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict() as z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter>;

export const NestedFloatWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional()
}).strict() as z.ZodType<Prisma.NestedFloatWithAggregatesFilter>;

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict() as z.ZodType<Prisma.NestedDateTimeNullableFilter>;

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict() as z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter>;

export const SubmissionCreateWithoutOwnerInputSchema: z.ZodType<Prisma.SubmissionCreateWithoutOwnerInput> = z.object({
  token: z.string(),
  src: z.string(),
  score: z.number().int().optional().nullable(),
  time: z.coerce.date(),
  challenge: z.lazy(() => ContestChallengeCreateNestedOneWithoutSubmissionsInputSchema),
  results: z.lazy(() => ResultCreateNestedManyWithoutSubmissionInputSchema).optional()
}).strict() as z.ZodType<Prisma.SubmissionCreateWithoutOwnerInput>;

export const SubmissionUncheckedCreateWithoutOwnerInputSchema: z.ZodType<Prisma.SubmissionUncheckedCreateWithoutOwnerInput> = z.object({
  token: z.string(),
  src: z.string(),
  contest_id: z.string(),
  challenge_id: z.string(),
  score: z.number().int().optional().nullable(),
  time: z.coerce.date(),
  results: z.lazy(() => ResultUncheckedCreateNestedManyWithoutSubmissionInputSchema).optional()
}).strict() as z.ZodType<Prisma.SubmissionUncheckedCreateWithoutOwnerInput>;

export const SubmissionCreateOrConnectWithoutOwnerInputSchema: z.ZodType<Prisma.SubmissionCreateOrConnectWithoutOwnerInput> = z.object({
  where: z.lazy(() => SubmissionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SubmissionCreateWithoutOwnerInputSchema),z.lazy(() => SubmissionUncheckedCreateWithoutOwnerInputSchema) ]),
}).strict() as z.ZodType<Prisma.SubmissionCreateOrConnectWithoutOwnerInput>;

export const ParticipantCreateWithoutUserInputSchema: z.ZodType<Prisma.ParticipantCreateWithoutUserInput> = z.object({
  time: z.coerce.date(),
  contest: z.lazy(() => ContestCreateNestedOneWithoutParticipantsInputSchema)
}).strict() as z.ZodType<Prisma.ParticipantCreateWithoutUserInput>;

export const ParticipantUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.ParticipantUncheckedCreateWithoutUserInput> = z.object({
  contest_id: z.string(),
  time: z.coerce.date()
}).strict() as z.ZodType<Prisma.ParticipantUncheckedCreateWithoutUserInput>;

export const ParticipantCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.ParticipantCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => ParticipantWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ParticipantCreateWithoutUserInputSchema),z.lazy(() => ParticipantUncheckedCreateWithoutUserInputSchema) ]),
}).strict() as z.ZodType<Prisma.ParticipantCreateOrConnectWithoutUserInput>;

export const SubmissionUpsertWithWhereUniqueWithoutOwnerInputSchema: z.ZodType<Prisma.SubmissionUpsertWithWhereUniqueWithoutOwnerInput> = z.object({
  where: z.lazy(() => SubmissionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => SubmissionUpdateWithoutOwnerInputSchema),z.lazy(() => SubmissionUncheckedUpdateWithoutOwnerInputSchema) ]),
  create: z.union([ z.lazy(() => SubmissionCreateWithoutOwnerInputSchema),z.lazy(() => SubmissionUncheckedCreateWithoutOwnerInputSchema) ]),
}).strict() as z.ZodType<Prisma.SubmissionUpsertWithWhereUniqueWithoutOwnerInput>;

export const SubmissionUpdateWithWhereUniqueWithoutOwnerInputSchema: z.ZodType<Prisma.SubmissionUpdateWithWhereUniqueWithoutOwnerInput> = z.object({
  where: z.lazy(() => SubmissionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => SubmissionUpdateWithoutOwnerInputSchema),z.lazy(() => SubmissionUncheckedUpdateWithoutOwnerInputSchema) ]),
}).strict() as z.ZodType<Prisma.SubmissionUpdateWithWhereUniqueWithoutOwnerInput>;

export const SubmissionUpdateManyWithWhereWithoutOwnerInputSchema: z.ZodType<Prisma.SubmissionUpdateManyWithWhereWithoutOwnerInput> = z.object({
  where: z.lazy(() => SubmissionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => SubmissionUpdateManyMutationInputSchema),z.lazy(() => SubmissionUncheckedUpdateManyWithoutOwnerInputSchema) ]),
}).strict() as z.ZodType<Prisma.SubmissionUpdateManyWithWhereWithoutOwnerInput>;

export const SubmissionScalarWhereInputSchema: z.ZodType<Prisma.SubmissionScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SubmissionScalarWhereInputSchema),z.lazy(() => SubmissionScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SubmissionScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SubmissionScalarWhereInputSchema),z.lazy(() => SubmissionScalarWhereInputSchema).array() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  owner_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  src: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  contest_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  challenge_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  score: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  time: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict() as z.ZodType<Prisma.SubmissionScalarWhereInput>;

export const ParticipantUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ParticipantUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ParticipantWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ParticipantUpdateWithoutUserInputSchema),z.lazy(() => ParticipantUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => ParticipantCreateWithoutUserInputSchema),z.lazy(() => ParticipantUncheckedCreateWithoutUserInputSchema) ]),
}).strict() as z.ZodType<Prisma.ParticipantUpsertWithWhereUniqueWithoutUserInput>;

export const ParticipantUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ParticipantUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ParticipantWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ParticipantUpdateWithoutUserInputSchema),z.lazy(() => ParticipantUncheckedUpdateWithoutUserInputSchema) ]),
}).strict() as z.ZodType<Prisma.ParticipantUpdateWithWhereUniqueWithoutUserInput>;

export const ParticipantUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.ParticipantUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => ParticipantScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ParticipantUpdateManyMutationInputSchema),z.lazy(() => ParticipantUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict() as z.ZodType<Prisma.ParticipantUpdateManyWithWhereWithoutUserInput>;

export const ParticipantScalarWhereInputSchema: z.ZodType<Prisma.ParticipantScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ParticipantScalarWhereInputSchema),z.lazy(() => ParticipantScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ParticipantScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ParticipantScalarWhereInputSchema),z.lazy(() => ParticipantScalarWhereInputSchema).array() ]).optional(),
  user_id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  contest_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  time: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict() as z.ZodType<Prisma.ParticipantScalarWhereInput>;

export const UserCreateWithoutSubmissionsInputSchema: z.ZodType<Prisma.UserCreateWithoutSubmissionsInput> = z.object({
  username: z.string(),
  password: z.string(),
  force_reset_password: z.boolean().optional(),
  admin: z.boolean().optional(),
  participants: z.lazy(() => ParticipantCreateNestedManyWithoutUserInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserCreateWithoutSubmissionsInput>;

export const UserUncheckedCreateWithoutSubmissionsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutSubmissionsInput> = z.object({
  id: z.number().int().optional(),
  username: z.string(),
  password: z.string(),
  force_reset_password: z.boolean().optional(),
  admin: z.boolean().optional(),
  participants: z.lazy(() => ParticipantUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserUncheckedCreateWithoutSubmissionsInput>;

export const UserCreateOrConnectWithoutSubmissionsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutSubmissionsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutSubmissionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSubmissionsInputSchema) ]),
}).strict() as z.ZodType<Prisma.UserCreateOrConnectWithoutSubmissionsInput>;

export const ContestChallengeCreateWithoutSubmissionsInputSchema: z.ZodType<Prisma.ContestChallengeCreateWithoutSubmissionsInput> = z.object({
  max_score: z.number().int(),
  challenge: z.lazy(() => ChallengeCreateNestedOneWithoutContestsInputSchema),
  contest: z.lazy(() => ContestCreateNestedOneWithoutChallengesInputSchema)
}).strict() as z.ZodType<Prisma.ContestChallengeCreateWithoutSubmissionsInput>;

export const ContestChallengeUncheckedCreateWithoutSubmissionsInputSchema: z.ZodType<Prisma.ContestChallengeUncheckedCreateWithoutSubmissionsInput> = z.object({
  challenge_id: z.string(),
  contest_id: z.string(),
  max_score: z.number().int()
}).strict() as z.ZodType<Prisma.ContestChallengeUncheckedCreateWithoutSubmissionsInput>;

export const ContestChallengeCreateOrConnectWithoutSubmissionsInputSchema: z.ZodType<Prisma.ContestChallengeCreateOrConnectWithoutSubmissionsInput> = z.object({
  where: z.lazy(() => ContestChallengeWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ContestChallengeCreateWithoutSubmissionsInputSchema),z.lazy(() => ContestChallengeUncheckedCreateWithoutSubmissionsInputSchema) ]),
}).strict() as z.ZodType<Prisma.ContestChallengeCreateOrConnectWithoutSubmissionsInput>;

export const ResultCreateWithoutSubmissionInputSchema: z.ZodType<Prisma.ResultCreateWithoutSubmissionInput> = z.object({
  token: z.string(),
  time: z.number(),
  memory: z.number().int(),
  status: z.string(),
  compile_output: z.string(),
  task: z.lazy(() => TaskCreateNestedOneWithoutResultInputSchema),
  test: z.lazy(() => TestCreateNestedOneWithoutResultInputSchema)
}).strict() as z.ZodType<Prisma.ResultCreateWithoutSubmissionInput>;

export const ResultUncheckedCreateWithoutSubmissionInputSchema: z.ZodType<Prisma.ResultUncheckedCreateWithoutSubmissionInput> = z.object({
  challenge_id: z.string(),
  task_number: z.number().int(),
  test_number: z.number().int(),
  token: z.string(),
  time: z.number(),
  memory: z.number().int(),
  status: z.string(),
  compile_output: z.string()
}).strict() as z.ZodType<Prisma.ResultUncheckedCreateWithoutSubmissionInput>;

export const ResultCreateOrConnectWithoutSubmissionInputSchema: z.ZodType<Prisma.ResultCreateOrConnectWithoutSubmissionInput> = z.object({
  where: z.lazy(() => ResultWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ResultCreateWithoutSubmissionInputSchema),z.lazy(() => ResultUncheckedCreateWithoutSubmissionInputSchema) ]),
}).strict() as z.ZodType<Prisma.ResultCreateOrConnectWithoutSubmissionInput>;

export const UserUpsertWithoutSubmissionsInputSchema: z.ZodType<Prisma.UserUpsertWithoutSubmissionsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutSubmissionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSubmissionsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutSubmissionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutSubmissionsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserUpsertWithoutSubmissionsInput>;

export const UserUpdateToOneWithWhereWithoutSubmissionsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutSubmissionsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutSubmissionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutSubmissionsInputSchema) ]),
}).strict() as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutSubmissionsInput>;

export const UserUpdateWithoutSubmissionsInputSchema: z.ZodType<Prisma.UserUpdateWithoutSubmissionsInput> = z.object({
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  force_reset_password: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  admin: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  participants: z.lazy(() => ParticipantUpdateManyWithoutUserNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserUpdateWithoutSubmissionsInput>;

export const UserUncheckedUpdateWithoutSubmissionsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutSubmissionsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  force_reset_password: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  admin: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  participants: z.lazy(() => ParticipantUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserUncheckedUpdateWithoutSubmissionsInput>;

export const ContestChallengeUpsertWithoutSubmissionsInputSchema: z.ZodType<Prisma.ContestChallengeUpsertWithoutSubmissionsInput> = z.object({
  update: z.union([ z.lazy(() => ContestChallengeUpdateWithoutSubmissionsInputSchema),z.lazy(() => ContestChallengeUncheckedUpdateWithoutSubmissionsInputSchema) ]),
  create: z.union([ z.lazy(() => ContestChallengeCreateWithoutSubmissionsInputSchema),z.lazy(() => ContestChallengeUncheckedCreateWithoutSubmissionsInputSchema) ]),
  where: z.lazy(() => ContestChallengeWhereInputSchema).optional()
}).strict() as z.ZodType<Prisma.ContestChallengeUpsertWithoutSubmissionsInput>;

export const ContestChallengeUpdateToOneWithWhereWithoutSubmissionsInputSchema: z.ZodType<Prisma.ContestChallengeUpdateToOneWithWhereWithoutSubmissionsInput> = z.object({
  where: z.lazy(() => ContestChallengeWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ContestChallengeUpdateWithoutSubmissionsInputSchema),z.lazy(() => ContestChallengeUncheckedUpdateWithoutSubmissionsInputSchema) ]),
}).strict() as z.ZodType<Prisma.ContestChallengeUpdateToOneWithWhereWithoutSubmissionsInput>;

export const ContestChallengeUpdateWithoutSubmissionsInputSchema: z.ZodType<Prisma.ContestChallengeUpdateWithoutSubmissionsInput> = z.object({
  max_score: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  challenge: z.lazy(() => ChallengeUpdateOneRequiredWithoutContestsNestedInputSchema).optional(),
  contest: z.lazy(() => ContestUpdateOneRequiredWithoutChallengesNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.ContestChallengeUpdateWithoutSubmissionsInput>;

export const ContestChallengeUncheckedUpdateWithoutSubmissionsInputSchema: z.ZodType<Prisma.ContestChallengeUncheckedUpdateWithoutSubmissionsInput> = z.object({
  challenge_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contest_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  max_score: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ContestChallengeUncheckedUpdateWithoutSubmissionsInput>;

export const ResultUpsertWithWhereUniqueWithoutSubmissionInputSchema: z.ZodType<Prisma.ResultUpsertWithWhereUniqueWithoutSubmissionInput> = z.object({
  where: z.lazy(() => ResultWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ResultUpdateWithoutSubmissionInputSchema),z.lazy(() => ResultUncheckedUpdateWithoutSubmissionInputSchema) ]),
  create: z.union([ z.lazy(() => ResultCreateWithoutSubmissionInputSchema),z.lazy(() => ResultUncheckedCreateWithoutSubmissionInputSchema) ]),
}).strict() as z.ZodType<Prisma.ResultUpsertWithWhereUniqueWithoutSubmissionInput>;

export const ResultUpdateWithWhereUniqueWithoutSubmissionInputSchema: z.ZodType<Prisma.ResultUpdateWithWhereUniqueWithoutSubmissionInput> = z.object({
  where: z.lazy(() => ResultWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ResultUpdateWithoutSubmissionInputSchema),z.lazy(() => ResultUncheckedUpdateWithoutSubmissionInputSchema) ]),
}).strict() as z.ZodType<Prisma.ResultUpdateWithWhereUniqueWithoutSubmissionInput>;

export const ResultUpdateManyWithWhereWithoutSubmissionInputSchema: z.ZodType<Prisma.ResultUpdateManyWithWhereWithoutSubmissionInput> = z.object({
  where: z.lazy(() => ResultScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ResultUpdateManyMutationInputSchema),z.lazy(() => ResultUncheckedUpdateManyWithoutSubmissionInputSchema) ]),
}).strict() as z.ZodType<Prisma.ResultUpdateManyWithWhereWithoutSubmissionInput>;

export const ResultScalarWhereInputSchema: z.ZodType<Prisma.ResultScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ResultScalarWhereInputSchema),z.lazy(() => ResultScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ResultScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ResultScalarWhereInputSchema),z.lazy(() => ResultScalarWhereInputSchema).array() ]).optional(),
  submission_token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  challenge_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  task_number: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  test_number: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  time: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  memory: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  compile_output: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict() as z.ZodType<Prisma.ResultScalarWhereInput>;

export const SubmissionCreateWithoutResultsInputSchema: z.ZodType<Prisma.SubmissionCreateWithoutResultsInput> = z.object({
  token: z.string(),
  src: z.string(),
  score: z.number().int().optional().nullable(),
  time: z.coerce.date(),
  owner: z.lazy(() => UserCreateNestedOneWithoutSubmissionsInputSchema),
  challenge: z.lazy(() => ContestChallengeCreateNestedOneWithoutSubmissionsInputSchema)
}).strict() as z.ZodType<Prisma.SubmissionCreateWithoutResultsInput>;

export const SubmissionUncheckedCreateWithoutResultsInputSchema: z.ZodType<Prisma.SubmissionUncheckedCreateWithoutResultsInput> = z.object({
  token: z.string(),
  owner_id: z.number().int(),
  src: z.string(),
  contest_id: z.string(),
  challenge_id: z.string(),
  score: z.number().int().optional().nullable(),
  time: z.coerce.date()
}).strict() as z.ZodType<Prisma.SubmissionUncheckedCreateWithoutResultsInput>;

export const SubmissionCreateOrConnectWithoutResultsInputSchema: z.ZodType<Prisma.SubmissionCreateOrConnectWithoutResultsInput> = z.object({
  where: z.lazy(() => SubmissionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SubmissionCreateWithoutResultsInputSchema),z.lazy(() => SubmissionUncheckedCreateWithoutResultsInputSchema) ]),
}).strict() as z.ZodType<Prisma.SubmissionCreateOrConnectWithoutResultsInput>;

export const TaskCreateWithoutResultInputSchema: z.ZodType<Prisma.TaskCreateWithoutResultInput> = z.object({
  type: z.string(),
  task_number: z.number().int(),
  weight: z.number().int(),
  challenge: z.lazy(() => ChallengeCreateNestedOneWithoutTasksInputSchema),
  tests: z.lazy(() => TestCreateNestedManyWithoutTaskInputSchema).optional()
}).strict() as z.ZodType<Prisma.TaskCreateWithoutResultInput>;

export const TaskUncheckedCreateWithoutResultInputSchema: z.ZodType<Prisma.TaskUncheckedCreateWithoutResultInput> = z.object({
  challenge_id: z.string(),
  type: z.string(),
  task_number: z.number().int(),
  weight: z.number().int(),
  tests: z.lazy(() => TestUncheckedCreateNestedManyWithoutTaskInputSchema).optional()
}).strict() as z.ZodType<Prisma.TaskUncheckedCreateWithoutResultInput>;

export const TaskCreateOrConnectWithoutResultInputSchema: z.ZodType<Prisma.TaskCreateOrConnectWithoutResultInput> = z.object({
  where: z.lazy(() => TaskWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TaskCreateWithoutResultInputSchema),z.lazy(() => TaskUncheckedCreateWithoutResultInputSchema) ]),
}).strict() as z.ZodType<Prisma.TaskCreateOrConnectWithoutResultInput>;

export const TestCreateWithoutResultInputSchema: z.ZodType<Prisma.TestCreateWithoutResultInput> = z.object({
  test_number: z.number().int(),
  is_example: z.boolean(),
  comment: z.string(),
  explanation: z.string(),
  input: z.string(),
  output: z.string(),
  task: z.lazy(() => TaskCreateNestedOneWithoutTestsInputSchema),
  challenge: z.lazy(() => ChallengeCreateNestedOneWithoutTestsInputSchema)
}).strict() as z.ZodType<Prisma.TestCreateWithoutResultInput>;

export const TestUncheckedCreateWithoutResultInputSchema: z.ZodType<Prisma.TestUncheckedCreateWithoutResultInput> = z.object({
  test_number: z.number().int(),
  is_example: z.boolean(),
  challenge_id: z.string(),
  task_number: z.number().int(),
  comment: z.string(),
  explanation: z.string(),
  input: z.string(),
  output: z.string()
}).strict() as z.ZodType<Prisma.TestUncheckedCreateWithoutResultInput>;

export const TestCreateOrConnectWithoutResultInputSchema: z.ZodType<Prisma.TestCreateOrConnectWithoutResultInput> = z.object({
  where: z.lazy(() => TestWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TestCreateWithoutResultInputSchema),z.lazy(() => TestUncheckedCreateWithoutResultInputSchema) ]),
}).strict() as z.ZodType<Prisma.TestCreateOrConnectWithoutResultInput>;

export const SubmissionUpsertWithoutResultsInputSchema: z.ZodType<Prisma.SubmissionUpsertWithoutResultsInput> = z.object({
  update: z.union([ z.lazy(() => SubmissionUpdateWithoutResultsInputSchema),z.lazy(() => SubmissionUncheckedUpdateWithoutResultsInputSchema) ]),
  create: z.union([ z.lazy(() => SubmissionCreateWithoutResultsInputSchema),z.lazy(() => SubmissionUncheckedCreateWithoutResultsInputSchema) ]),
  where: z.lazy(() => SubmissionWhereInputSchema).optional()
}).strict() as z.ZodType<Prisma.SubmissionUpsertWithoutResultsInput>;

export const SubmissionUpdateToOneWithWhereWithoutResultsInputSchema: z.ZodType<Prisma.SubmissionUpdateToOneWithWhereWithoutResultsInput> = z.object({
  where: z.lazy(() => SubmissionWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => SubmissionUpdateWithoutResultsInputSchema),z.lazy(() => SubmissionUncheckedUpdateWithoutResultsInputSchema) ]),
}).strict() as z.ZodType<Prisma.SubmissionUpdateToOneWithWhereWithoutResultsInput>;

export const SubmissionUpdateWithoutResultsInputSchema: z.ZodType<Prisma.SubmissionUpdateWithoutResultsInput> = z.object({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  src: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutSubmissionsNestedInputSchema).optional(),
  challenge: z.lazy(() => ContestChallengeUpdateOneRequiredWithoutSubmissionsNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.SubmissionUpdateWithoutResultsInput>;

export const SubmissionUncheckedUpdateWithoutResultsInputSchema: z.ZodType<Prisma.SubmissionUncheckedUpdateWithoutResultsInput> = z.object({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  owner_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  src: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contest_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  challenge_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.SubmissionUncheckedUpdateWithoutResultsInput>;

export const TaskUpsertWithoutResultInputSchema: z.ZodType<Prisma.TaskUpsertWithoutResultInput> = z.object({
  update: z.union([ z.lazy(() => TaskUpdateWithoutResultInputSchema),z.lazy(() => TaskUncheckedUpdateWithoutResultInputSchema) ]),
  create: z.union([ z.lazy(() => TaskCreateWithoutResultInputSchema),z.lazy(() => TaskUncheckedCreateWithoutResultInputSchema) ]),
  where: z.lazy(() => TaskWhereInputSchema).optional()
}).strict() as z.ZodType<Prisma.TaskUpsertWithoutResultInput>;

export const TaskUpdateToOneWithWhereWithoutResultInputSchema: z.ZodType<Prisma.TaskUpdateToOneWithWhereWithoutResultInput> = z.object({
  where: z.lazy(() => TaskWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => TaskUpdateWithoutResultInputSchema),z.lazy(() => TaskUncheckedUpdateWithoutResultInputSchema) ]),
}).strict() as z.ZodType<Prisma.TaskUpdateToOneWithWhereWithoutResultInput>;

export const TaskUpdateWithoutResultInputSchema: z.ZodType<Prisma.TaskUpdateWithoutResultInput> = z.object({
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  task_number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  weight: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  challenge: z.lazy(() => ChallengeUpdateOneRequiredWithoutTasksNestedInputSchema).optional(),
  tests: z.lazy(() => TestUpdateManyWithoutTaskNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.TaskUpdateWithoutResultInput>;

export const TaskUncheckedUpdateWithoutResultInputSchema: z.ZodType<Prisma.TaskUncheckedUpdateWithoutResultInput> = z.object({
  challenge_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  task_number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  weight: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  tests: z.lazy(() => TestUncheckedUpdateManyWithoutTaskNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.TaskUncheckedUpdateWithoutResultInput>;

export const TestUpsertWithoutResultInputSchema: z.ZodType<Prisma.TestUpsertWithoutResultInput> = z.object({
  update: z.union([ z.lazy(() => TestUpdateWithoutResultInputSchema),z.lazy(() => TestUncheckedUpdateWithoutResultInputSchema) ]),
  create: z.union([ z.lazy(() => TestCreateWithoutResultInputSchema),z.lazy(() => TestUncheckedCreateWithoutResultInputSchema) ]),
  where: z.lazy(() => TestWhereInputSchema).optional()
}).strict() as z.ZodType<Prisma.TestUpsertWithoutResultInput>;

export const TestUpdateToOneWithWhereWithoutResultInputSchema: z.ZodType<Prisma.TestUpdateToOneWithWhereWithoutResultInput> = z.object({
  where: z.lazy(() => TestWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => TestUpdateWithoutResultInputSchema),z.lazy(() => TestUncheckedUpdateWithoutResultInputSchema) ]),
}).strict() as z.ZodType<Prisma.TestUpdateToOneWithWhereWithoutResultInput>;

export const TestUpdateWithoutResultInputSchema: z.ZodType<Prisma.TestUpdateWithoutResultInput> = z.object({
  test_number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  is_example: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  comment: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  explanation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  input: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  output: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  task: z.lazy(() => TaskUpdateOneRequiredWithoutTestsNestedInputSchema).optional(),
  challenge: z.lazy(() => ChallengeUpdateOneRequiredWithoutTestsNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.TestUpdateWithoutResultInput>;

export const TestUncheckedUpdateWithoutResultInputSchema: z.ZodType<Prisma.TestUncheckedUpdateWithoutResultInput> = z.object({
  test_number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  is_example: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  challenge_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  task_number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  comment: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  explanation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  input: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  output: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.TestUncheckedUpdateWithoutResultInput>;

export const UserCreateWithoutParticipantsInputSchema: z.ZodType<Prisma.UserCreateWithoutParticipantsInput> = z.object({
  username: z.string(),
  password: z.string(),
  force_reset_password: z.boolean().optional(),
  admin: z.boolean().optional(),
  submissions: z.lazy(() => SubmissionCreateNestedManyWithoutOwnerInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserCreateWithoutParticipantsInput>;

export const UserUncheckedCreateWithoutParticipantsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutParticipantsInput> = z.object({
  id: z.number().int().optional(),
  username: z.string(),
  password: z.string(),
  force_reset_password: z.boolean().optional(),
  admin: z.boolean().optional(),
  submissions: z.lazy(() => SubmissionUncheckedCreateNestedManyWithoutOwnerInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserUncheckedCreateWithoutParticipantsInput>;

export const UserCreateOrConnectWithoutParticipantsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutParticipantsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutParticipantsInputSchema),z.lazy(() => UserUncheckedCreateWithoutParticipantsInputSchema) ]),
}).strict() as z.ZodType<Prisma.UserCreateOrConnectWithoutParticipantsInput>;

export const ContestCreateWithoutParticipantsInputSchema: z.ZodType<Prisma.ContestCreateWithoutParticipantsInput> = z.object({
  id: z.string(),
  title: z.string(),
  start_time: z.coerce.date().optional().nullable(),
  end_time: z.coerce.date().optional().nullable(),
  description: z.string(),
  challenges: z.lazy(() => ContestChallengeCreateNestedManyWithoutContestInputSchema).optional()
}).strict() as z.ZodType<Prisma.ContestCreateWithoutParticipantsInput>;

export const ContestUncheckedCreateWithoutParticipantsInputSchema: z.ZodType<Prisma.ContestUncheckedCreateWithoutParticipantsInput> = z.object({
  id: z.string(),
  title: z.string(),
  start_time: z.coerce.date().optional().nullable(),
  end_time: z.coerce.date().optional().nullable(),
  description: z.string(),
  challenges: z.lazy(() => ContestChallengeUncheckedCreateNestedManyWithoutContestInputSchema).optional()
}).strict() as z.ZodType<Prisma.ContestUncheckedCreateWithoutParticipantsInput>;

export const ContestCreateOrConnectWithoutParticipantsInputSchema: z.ZodType<Prisma.ContestCreateOrConnectWithoutParticipantsInput> = z.object({
  where: z.lazy(() => ContestWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ContestCreateWithoutParticipantsInputSchema),z.lazy(() => ContestUncheckedCreateWithoutParticipantsInputSchema) ]),
}).strict() as z.ZodType<Prisma.ContestCreateOrConnectWithoutParticipantsInput>;

export const UserUpsertWithoutParticipantsInputSchema: z.ZodType<Prisma.UserUpsertWithoutParticipantsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutParticipantsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutParticipantsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutParticipantsInputSchema),z.lazy(() => UserUncheckedCreateWithoutParticipantsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserUpsertWithoutParticipantsInput>;

export const UserUpdateToOneWithWhereWithoutParticipantsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutParticipantsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutParticipantsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutParticipantsInputSchema) ]),
}).strict() as z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutParticipantsInput>;

export const UserUpdateWithoutParticipantsInputSchema: z.ZodType<Prisma.UserUpdateWithoutParticipantsInput> = z.object({
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  force_reset_password: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  admin: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  submissions: z.lazy(() => SubmissionUpdateManyWithoutOwnerNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserUpdateWithoutParticipantsInput>;

export const UserUncheckedUpdateWithoutParticipantsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutParticipantsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  username: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  force_reset_password: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  admin: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  submissions: z.lazy(() => SubmissionUncheckedUpdateManyWithoutOwnerNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.UserUncheckedUpdateWithoutParticipantsInput>;

export const ContestUpsertWithoutParticipantsInputSchema: z.ZodType<Prisma.ContestUpsertWithoutParticipantsInput> = z.object({
  update: z.union([ z.lazy(() => ContestUpdateWithoutParticipantsInputSchema),z.lazy(() => ContestUncheckedUpdateWithoutParticipantsInputSchema) ]),
  create: z.union([ z.lazy(() => ContestCreateWithoutParticipantsInputSchema),z.lazy(() => ContestUncheckedCreateWithoutParticipantsInputSchema) ]),
  where: z.lazy(() => ContestWhereInputSchema).optional()
}).strict() as z.ZodType<Prisma.ContestUpsertWithoutParticipantsInput>;

export const ContestUpdateToOneWithWhereWithoutParticipantsInputSchema: z.ZodType<Prisma.ContestUpdateToOneWithWhereWithoutParticipantsInput> = z.object({
  where: z.lazy(() => ContestWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ContestUpdateWithoutParticipantsInputSchema),z.lazy(() => ContestUncheckedUpdateWithoutParticipantsInputSchema) ]),
}).strict() as z.ZodType<Prisma.ContestUpdateToOneWithWhereWithoutParticipantsInput>;

export const ContestUpdateWithoutParticipantsInputSchema: z.ZodType<Prisma.ContestUpdateWithoutParticipantsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  start_time: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  end_time: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  challenges: z.lazy(() => ContestChallengeUpdateManyWithoutContestNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.ContestUpdateWithoutParticipantsInput>;

export const ContestUncheckedUpdateWithoutParticipantsInputSchema: z.ZodType<Prisma.ContestUncheckedUpdateWithoutParticipantsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  start_time: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  end_time: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  challenges: z.lazy(() => ContestChallengeUncheckedUpdateManyWithoutContestNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.ContestUncheckedUpdateWithoutParticipantsInput>;

export const ContestChallengeCreateWithoutContestInputSchema: z.ZodType<Prisma.ContestChallengeCreateWithoutContestInput> = z.object({
  max_score: z.number().int(),
  challenge: z.lazy(() => ChallengeCreateNestedOneWithoutContestsInputSchema),
  submissions: z.lazy(() => SubmissionCreateNestedManyWithoutChallengeInputSchema).optional()
}).strict() as z.ZodType<Prisma.ContestChallengeCreateWithoutContestInput>;

export const ContestChallengeUncheckedCreateWithoutContestInputSchema: z.ZodType<Prisma.ContestChallengeUncheckedCreateWithoutContestInput> = z.object({
  challenge_id: z.string(),
  max_score: z.number().int(),
  submissions: z.lazy(() => SubmissionUncheckedCreateNestedManyWithoutChallengeInputSchema).optional()
}).strict() as z.ZodType<Prisma.ContestChallengeUncheckedCreateWithoutContestInput>;

export const ContestChallengeCreateOrConnectWithoutContestInputSchema: z.ZodType<Prisma.ContestChallengeCreateOrConnectWithoutContestInput> = z.object({
  where: z.lazy(() => ContestChallengeWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ContestChallengeCreateWithoutContestInputSchema),z.lazy(() => ContestChallengeUncheckedCreateWithoutContestInputSchema) ]),
}).strict() as z.ZodType<Prisma.ContestChallengeCreateOrConnectWithoutContestInput>;

export const ParticipantCreateWithoutContestInputSchema: z.ZodType<Prisma.ParticipantCreateWithoutContestInput> = z.object({
  time: z.coerce.date(),
  user: z.lazy(() => UserCreateNestedOneWithoutParticipantsInputSchema)
}).strict() as z.ZodType<Prisma.ParticipantCreateWithoutContestInput>;

export const ParticipantUncheckedCreateWithoutContestInputSchema: z.ZodType<Prisma.ParticipantUncheckedCreateWithoutContestInput> = z.object({
  user_id: z.number().int(),
  time: z.coerce.date()
}).strict() as z.ZodType<Prisma.ParticipantUncheckedCreateWithoutContestInput>;

export const ParticipantCreateOrConnectWithoutContestInputSchema: z.ZodType<Prisma.ParticipantCreateOrConnectWithoutContestInput> = z.object({
  where: z.lazy(() => ParticipantWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ParticipantCreateWithoutContestInputSchema),z.lazy(() => ParticipantUncheckedCreateWithoutContestInputSchema) ]),
}).strict() as z.ZodType<Prisma.ParticipantCreateOrConnectWithoutContestInput>;

export const ContestChallengeUpsertWithWhereUniqueWithoutContestInputSchema: z.ZodType<Prisma.ContestChallengeUpsertWithWhereUniqueWithoutContestInput> = z.object({
  where: z.lazy(() => ContestChallengeWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ContestChallengeUpdateWithoutContestInputSchema),z.lazy(() => ContestChallengeUncheckedUpdateWithoutContestInputSchema) ]),
  create: z.union([ z.lazy(() => ContestChallengeCreateWithoutContestInputSchema),z.lazy(() => ContestChallengeUncheckedCreateWithoutContestInputSchema) ]),
}).strict() as z.ZodType<Prisma.ContestChallengeUpsertWithWhereUniqueWithoutContestInput>;

export const ContestChallengeUpdateWithWhereUniqueWithoutContestInputSchema: z.ZodType<Prisma.ContestChallengeUpdateWithWhereUniqueWithoutContestInput> = z.object({
  where: z.lazy(() => ContestChallengeWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ContestChallengeUpdateWithoutContestInputSchema),z.lazy(() => ContestChallengeUncheckedUpdateWithoutContestInputSchema) ]),
}).strict() as z.ZodType<Prisma.ContestChallengeUpdateWithWhereUniqueWithoutContestInput>;

export const ContestChallengeUpdateManyWithWhereWithoutContestInputSchema: z.ZodType<Prisma.ContestChallengeUpdateManyWithWhereWithoutContestInput> = z.object({
  where: z.lazy(() => ContestChallengeScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ContestChallengeUpdateManyMutationInputSchema),z.lazy(() => ContestChallengeUncheckedUpdateManyWithoutContestInputSchema) ]),
}).strict() as z.ZodType<Prisma.ContestChallengeUpdateManyWithWhereWithoutContestInput>;

export const ContestChallengeScalarWhereInputSchema: z.ZodType<Prisma.ContestChallengeScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ContestChallengeScalarWhereInputSchema),z.lazy(() => ContestChallengeScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContestChallengeScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContestChallengeScalarWhereInputSchema),z.lazy(() => ContestChallengeScalarWhereInputSchema).array() ]).optional(),
  challenge_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  contest_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  max_score: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict() as z.ZodType<Prisma.ContestChallengeScalarWhereInput>;

export const ParticipantUpsertWithWhereUniqueWithoutContestInputSchema: z.ZodType<Prisma.ParticipantUpsertWithWhereUniqueWithoutContestInput> = z.object({
  where: z.lazy(() => ParticipantWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ParticipantUpdateWithoutContestInputSchema),z.lazy(() => ParticipantUncheckedUpdateWithoutContestInputSchema) ]),
  create: z.union([ z.lazy(() => ParticipantCreateWithoutContestInputSchema),z.lazy(() => ParticipantUncheckedCreateWithoutContestInputSchema) ]),
}).strict() as z.ZodType<Prisma.ParticipantUpsertWithWhereUniqueWithoutContestInput>;

export const ParticipantUpdateWithWhereUniqueWithoutContestInputSchema: z.ZodType<Prisma.ParticipantUpdateWithWhereUniqueWithoutContestInput> = z.object({
  where: z.lazy(() => ParticipantWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ParticipantUpdateWithoutContestInputSchema),z.lazy(() => ParticipantUncheckedUpdateWithoutContestInputSchema) ]),
}).strict() as z.ZodType<Prisma.ParticipantUpdateWithWhereUniqueWithoutContestInput>;

export const ParticipantUpdateManyWithWhereWithoutContestInputSchema: z.ZodType<Prisma.ParticipantUpdateManyWithWhereWithoutContestInput> = z.object({
  where: z.lazy(() => ParticipantScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ParticipantUpdateManyMutationInputSchema),z.lazy(() => ParticipantUncheckedUpdateManyWithoutContestInputSchema) ]),
}).strict() as z.ZodType<Prisma.ParticipantUpdateManyWithWhereWithoutContestInput>;

export const ChallengeCreateWithoutContestsInputSchema: z.ZodType<Prisma.ChallengeCreateWithoutContestsInput> = z.object({
  id: z.string(),
  title: z.string(),
  type: z.string(),
  description: z.string(),
  input_format: z.string(),
  output_format: z.string(),
  time_limit: z.number().int(),
  memory_limit: z.number().int(),
  tasks: z.lazy(() => TaskCreateNestedManyWithoutChallengeInputSchema).optional(),
  tests: z.lazy(() => TestCreateNestedManyWithoutChallengeInputSchema).optional()
}).strict() as z.ZodType<Prisma.ChallengeCreateWithoutContestsInput>;

export const ChallengeUncheckedCreateWithoutContestsInputSchema: z.ZodType<Prisma.ChallengeUncheckedCreateWithoutContestsInput> = z.object({
  id: z.string(),
  title: z.string(),
  type: z.string(),
  description: z.string(),
  input_format: z.string(),
  output_format: z.string(),
  time_limit: z.number().int(),
  memory_limit: z.number().int(),
  tasks: z.lazy(() => TaskUncheckedCreateNestedManyWithoutChallengeInputSchema).optional(),
  tests: z.lazy(() => TestUncheckedCreateNestedManyWithoutChallengeInputSchema).optional()
}).strict() as z.ZodType<Prisma.ChallengeUncheckedCreateWithoutContestsInput>;

export const ChallengeCreateOrConnectWithoutContestsInputSchema: z.ZodType<Prisma.ChallengeCreateOrConnectWithoutContestsInput> = z.object({
  where: z.lazy(() => ChallengeWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ChallengeCreateWithoutContestsInputSchema),z.lazy(() => ChallengeUncheckedCreateWithoutContestsInputSchema) ]),
}).strict() as z.ZodType<Prisma.ChallengeCreateOrConnectWithoutContestsInput>;

export const ContestCreateWithoutChallengesInputSchema: z.ZodType<Prisma.ContestCreateWithoutChallengesInput> = z.object({
  id: z.string(),
  title: z.string(),
  start_time: z.coerce.date().optional().nullable(),
  end_time: z.coerce.date().optional().nullable(),
  description: z.string(),
  participants: z.lazy(() => ParticipantCreateNestedManyWithoutContestInputSchema).optional()
}).strict() as z.ZodType<Prisma.ContestCreateWithoutChallengesInput>;

export const ContestUncheckedCreateWithoutChallengesInputSchema: z.ZodType<Prisma.ContestUncheckedCreateWithoutChallengesInput> = z.object({
  id: z.string(),
  title: z.string(),
  start_time: z.coerce.date().optional().nullable(),
  end_time: z.coerce.date().optional().nullable(),
  description: z.string(),
  participants: z.lazy(() => ParticipantUncheckedCreateNestedManyWithoutContestInputSchema).optional()
}).strict() as z.ZodType<Prisma.ContestUncheckedCreateWithoutChallengesInput>;

export const ContestCreateOrConnectWithoutChallengesInputSchema: z.ZodType<Prisma.ContestCreateOrConnectWithoutChallengesInput> = z.object({
  where: z.lazy(() => ContestWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ContestCreateWithoutChallengesInputSchema),z.lazy(() => ContestUncheckedCreateWithoutChallengesInputSchema) ]),
}).strict() as z.ZodType<Prisma.ContestCreateOrConnectWithoutChallengesInput>;

export const SubmissionCreateWithoutChallengeInputSchema: z.ZodType<Prisma.SubmissionCreateWithoutChallengeInput> = z.object({
  token: z.string(),
  src: z.string(),
  score: z.number().int().optional().nullable(),
  time: z.coerce.date(),
  owner: z.lazy(() => UserCreateNestedOneWithoutSubmissionsInputSchema),
  results: z.lazy(() => ResultCreateNestedManyWithoutSubmissionInputSchema).optional()
}).strict() as z.ZodType<Prisma.SubmissionCreateWithoutChallengeInput>;

export const SubmissionUncheckedCreateWithoutChallengeInputSchema: z.ZodType<Prisma.SubmissionUncheckedCreateWithoutChallengeInput> = z.object({
  token: z.string(),
  owner_id: z.number().int(),
  src: z.string(),
  score: z.number().int().optional().nullable(),
  time: z.coerce.date(),
  results: z.lazy(() => ResultUncheckedCreateNestedManyWithoutSubmissionInputSchema).optional()
}).strict() as z.ZodType<Prisma.SubmissionUncheckedCreateWithoutChallengeInput>;

export const SubmissionCreateOrConnectWithoutChallengeInputSchema: z.ZodType<Prisma.SubmissionCreateOrConnectWithoutChallengeInput> = z.object({
  where: z.lazy(() => SubmissionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SubmissionCreateWithoutChallengeInputSchema),z.lazy(() => SubmissionUncheckedCreateWithoutChallengeInputSchema) ]),
}).strict() as z.ZodType<Prisma.SubmissionCreateOrConnectWithoutChallengeInput>;

export const ChallengeUpsertWithoutContestsInputSchema: z.ZodType<Prisma.ChallengeUpsertWithoutContestsInput> = z.object({
  update: z.union([ z.lazy(() => ChallengeUpdateWithoutContestsInputSchema),z.lazy(() => ChallengeUncheckedUpdateWithoutContestsInputSchema) ]),
  create: z.union([ z.lazy(() => ChallengeCreateWithoutContestsInputSchema),z.lazy(() => ChallengeUncheckedCreateWithoutContestsInputSchema) ]),
  where: z.lazy(() => ChallengeWhereInputSchema).optional()
}).strict() as z.ZodType<Prisma.ChallengeUpsertWithoutContestsInput>;

export const ChallengeUpdateToOneWithWhereWithoutContestsInputSchema: z.ZodType<Prisma.ChallengeUpdateToOneWithWhereWithoutContestsInput> = z.object({
  where: z.lazy(() => ChallengeWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ChallengeUpdateWithoutContestsInputSchema),z.lazy(() => ChallengeUncheckedUpdateWithoutContestsInputSchema) ]),
}).strict() as z.ZodType<Prisma.ChallengeUpdateToOneWithWhereWithoutContestsInput>;

export const ChallengeUpdateWithoutContestsInputSchema: z.ZodType<Prisma.ChallengeUpdateWithoutContestsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  input_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  output_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time_limit: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  memory_limit: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  tasks: z.lazy(() => TaskUpdateManyWithoutChallengeNestedInputSchema).optional(),
  tests: z.lazy(() => TestUpdateManyWithoutChallengeNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.ChallengeUpdateWithoutContestsInput>;

export const ChallengeUncheckedUpdateWithoutContestsInputSchema: z.ZodType<Prisma.ChallengeUncheckedUpdateWithoutContestsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  input_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  output_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time_limit: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  memory_limit: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  tasks: z.lazy(() => TaskUncheckedUpdateManyWithoutChallengeNestedInputSchema).optional(),
  tests: z.lazy(() => TestUncheckedUpdateManyWithoutChallengeNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.ChallengeUncheckedUpdateWithoutContestsInput>;

export const ContestUpsertWithoutChallengesInputSchema: z.ZodType<Prisma.ContestUpsertWithoutChallengesInput> = z.object({
  update: z.union([ z.lazy(() => ContestUpdateWithoutChallengesInputSchema),z.lazy(() => ContestUncheckedUpdateWithoutChallengesInputSchema) ]),
  create: z.union([ z.lazy(() => ContestCreateWithoutChallengesInputSchema),z.lazy(() => ContestUncheckedCreateWithoutChallengesInputSchema) ]),
  where: z.lazy(() => ContestWhereInputSchema).optional()
}).strict() as z.ZodType<Prisma.ContestUpsertWithoutChallengesInput>;

export const ContestUpdateToOneWithWhereWithoutChallengesInputSchema: z.ZodType<Prisma.ContestUpdateToOneWithWhereWithoutChallengesInput> = z.object({
  where: z.lazy(() => ContestWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ContestUpdateWithoutChallengesInputSchema),z.lazy(() => ContestUncheckedUpdateWithoutChallengesInputSchema) ]),
}).strict() as z.ZodType<Prisma.ContestUpdateToOneWithWhereWithoutChallengesInput>;

export const ContestUpdateWithoutChallengesInputSchema: z.ZodType<Prisma.ContestUpdateWithoutChallengesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  start_time: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  end_time: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  participants: z.lazy(() => ParticipantUpdateManyWithoutContestNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.ContestUpdateWithoutChallengesInput>;

export const ContestUncheckedUpdateWithoutChallengesInputSchema: z.ZodType<Prisma.ContestUncheckedUpdateWithoutChallengesInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  start_time: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  end_time: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  participants: z.lazy(() => ParticipantUncheckedUpdateManyWithoutContestNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.ContestUncheckedUpdateWithoutChallengesInput>;

export const SubmissionUpsertWithWhereUniqueWithoutChallengeInputSchema: z.ZodType<Prisma.SubmissionUpsertWithWhereUniqueWithoutChallengeInput> = z.object({
  where: z.lazy(() => SubmissionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => SubmissionUpdateWithoutChallengeInputSchema),z.lazy(() => SubmissionUncheckedUpdateWithoutChallengeInputSchema) ]),
  create: z.union([ z.lazy(() => SubmissionCreateWithoutChallengeInputSchema),z.lazy(() => SubmissionUncheckedCreateWithoutChallengeInputSchema) ]),
}).strict() as z.ZodType<Prisma.SubmissionUpsertWithWhereUniqueWithoutChallengeInput>;

export const SubmissionUpdateWithWhereUniqueWithoutChallengeInputSchema: z.ZodType<Prisma.SubmissionUpdateWithWhereUniqueWithoutChallengeInput> = z.object({
  where: z.lazy(() => SubmissionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => SubmissionUpdateWithoutChallengeInputSchema),z.lazy(() => SubmissionUncheckedUpdateWithoutChallengeInputSchema) ]),
}).strict() as z.ZodType<Prisma.SubmissionUpdateWithWhereUniqueWithoutChallengeInput>;

export const SubmissionUpdateManyWithWhereWithoutChallengeInputSchema: z.ZodType<Prisma.SubmissionUpdateManyWithWhereWithoutChallengeInput> = z.object({
  where: z.lazy(() => SubmissionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => SubmissionUpdateManyMutationInputSchema),z.lazy(() => SubmissionUncheckedUpdateManyWithoutChallengeInputSchema) ]),
}).strict() as z.ZodType<Prisma.SubmissionUpdateManyWithWhereWithoutChallengeInput>;

export const TaskCreateWithoutChallengeInputSchema: z.ZodType<Prisma.TaskCreateWithoutChallengeInput> = z.object({
  type: z.string(),
  task_number: z.number().int(),
  weight: z.number().int(),
  tests: z.lazy(() => TestCreateNestedManyWithoutTaskInputSchema).optional(),
  Result: z.lazy(() => ResultCreateNestedManyWithoutTaskInputSchema).optional()
}).strict() as z.ZodType<Prisma.TaskCreateWithoutChallengeInput>;

export const TaskUncheckedCreateWithoutChallengeInputSchema: z.ZodType<Prisma.TaskUncheckedCreateWithoutChallengeInput> = z.object({
  type: z.string(),
  task_number: z.number().int(),
  weight: z.number().int(),
  tests: z.lazy(() => TestUncheckedCreateNestedManyWithoutTaskInputSchema).optional(),
  Result: z.lazy(() => ResultUncheckedCreateNestedManyWithoutTaskInputSchema).optional()
}).strict() as z.ZodType<Prisma.TaskUncheckedCreateWithoutChallengeInput>;

export const TaskCreateOrConnectWithoutChallengeInputSchema: z.ZodType<Prisma.TaskCreateOrConnectWithoutChallengeInput> = z.object({
  where: z.lazy(() => TaskWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TaskCreateWithoutChallengeInputSchema),z.lazy(() => TaskUncheckedCreateWithoutChallengeInputSchema) ]),
}).strict() as z.ZodType<Prisma.TaskCreateOrConnectWithoutChallengeInput>;

export const ContestChallengeCreateWithoutChallengeInputSchema: z.ZodType<Prisma.ContestChallengeCreateWithoutChallengeInput> = z.object({
  max_score: z.number().int(),
  contest: z.lazy(() => ContestCreateNestedOneWithoutChallengesInputSchema),
  submissions: z.lazy(() => SubmissionCreateNestedManyWithoutChallengeInputSchema).optional()
}).strict() as z.ZodType<Prisma.ContestChallengeCreateWithoutChallengeInput>;

export const ContestChallengeUncheckedCreateWithoutChallengeInputSchema: z.ZodType<Prisma.ContestChallengeUncheckedCreateWithoutChallengeInput> = z.object({
  contest_id: z.string(),
  max_score: z.number().int(),
  submissions: z.lazy(() => SubmissionUncheckedCreateNestedManyWithoutChallengeInputSchema).optional()
}).strict() as z.ZodType<Prisma.ContestChallengeUncheckedCreateWithoutChallengeInput>;

export const ContestChallengeCreateOrConnectWithoutChallengeInputSchema: z.ZodType<Prisma.ContestChallengeCreateOrConnectWithoutChallengeInput> = z.object({
  where: z.lazy(() => ContestChallengeWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ContestChallengeCreateWithoutChallengeInputSchema),z.lazy(() => ContestChallengeUncheckedCreateWithoutChallengeInputSchema) ]),
}).strict() as z.ZodType<Prisma.ContestChallengeCreateOrConnectWithoutChallengeInput>;

export const TestCreateWithoutChallengeInputSchema: z.ZodType<Prisma.TestCreateWithoutChallengeInput> = z.object({
  test_number: z.number().int(),
  is_example: z.boolean(),
  comment: z.string(),
  explanation: z.string(),
  input: z.string(),
  output: z.string(),
  task: z.lazy(() => TaskCreateNestedOneWithoutTestsInputSchema),
  Result: z.lazy(() => ResultCreateNestedManyWithoutTestInputSchema).optional()
}).strict() as z.ZodType<Prisma.TestCreateWithoutChallengeInput>;

export const TestUncheckedCreateWithoutChallengeInputSchema: z.ZodType<Prisma.TestUncheckedCreateWithoutChallengeInput> = z.object({
  test_number: z.number().int(),
  is_example: z.boolean(),
  task_number: z.number().int(),
  comment: z.string(),
  explanation: z.string(),
  input: z.string(),
  output: z.string(),
  Result: z.lazy(() => ResultUncheckedCreateNestedManyWithoutTestInputSchema).optional()
}).strict() as z.ZodType<Prisma.TestUncheckedCreateWithoutChallengeInput>;

export const TestCreateOrConnectWithoutChallengeInputSchema: z.ZodType<Prisma.TestCreateOrConnectWithoutChallengeInput> = z.object({
  where: z.lazy(() => TestWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TestCreateWithoutChallengeInputSchema),z.lazy(() => TestUncheckedCreateWithoutChallengeInputSchema) ]),
}).strict() as z.ZodType<Prisma.TestCreateOrConnectWithoutChallengeInput>;

export const TaskUpsertWithWhereUniqueWithoutChallengeInputSchema: z.ZodType<Prisma.TaskUpsertWithWhereUniqueWithoutChallengeInput> = z.object({
  where: z.lazy(() => TaskWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TaskUpdateWithoutChallengeInputSchema),z.lazy(() => TaskUncheckedUpdateWithoutChallengeInputSchema) ]),
  create: z.union([ z.lazy(() => TaskCreateWithoutChallengeInputSchema),z.lazy(() => TaskUncheckedCreateWithoutChallengeInputSchema) ]),
}).strict() as z.ZodType<Prisma.TaskUpsertWithWhereUniqueWithoutChallengeInput>;

export const TaskUpdateWithWhereUniqueWithoutChallengeInputSchema: z.ZodType<Prisma.TaskUpdateWithWhereUniqueWithoutChallengeInput> = z.object({
  where: z.lazy(() => TaskWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TaskUpdateWithoutChallengeInputSchema),z.lazy(() => TaskUncheckedUpdateWithoutChallengeInputSchema) ]),
}).strict() as z.ZodType<Prisma.TaskUpdateWithWhereUniqueWithoutChallengeInput>;

export const TaskUpdateManyWithWhereWithoutChallengeInputSchema: z.ZodType<Prisma.TaskUpdateManyWithWhereWithoutChallengeInput> = z.object({
  where: z.lazy(() => TaskScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TaskUpdateManyMutationInputSchema),z.lazy(() => TaskUncheckedUpdateManyWithoutChallengeInputSchema) ]),
}).strict() as z.ZodType<Prisma.TaskUpdateManyWithWhereWithoutChallengeInput>;

export const TaskScalarWhereInputSchema: z.ZodType<Prisma.TaskScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TaskScalarWhereInputSchema),z.lazy(() => TaskScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TaskScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TaskScalarWhereInputSchema),z.lazy(() => TaskScalarWhereInputSchema).array() ]).optional(),
  challenge_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  type: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  task_number: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  weight: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
}).strict() as z.ZodType<Prisma.TaskScalarWhereInput>;

export const ContestChallengeUpsertWithWhereUniqueWithoutChallengeInputSchema: z.ZodType<Prisma.ContestChallengeUpsertWithWhereUniqueWithoutChallengeInput> = z.object({
  where: z.lazy(() => ContestChallengeWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ContestChallengeUpdateWithoutChallengeInputSchema),z.lazy(() => ContestChallengeUncheckedUpdateWithoutChallengeInputSchema) ]),
  create: z.union([ z.lazy(() => ContestChallengeCreateWithoutChallengeInputSchema),z.lazy(() => ContestChallengeUncheckedCreateWithoutChallengeInputSchema) ]),
}).strict() as z.ZodType<Prisma.ContestChallengeUpsertWithWhereUniqueWithoutChallengeInput>;

export const ContestChallengeUpdateWithWhereUniqueWithoutChallengeInputSchema: z.ZodType<Prisma.ContestChallengeUpdateWithWhereUniqueWithoutChallengeInput> = z.object({
  where: z.lazy(() => ContestChallengeWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ContestChallengeUpdateWithoutChallengeInputSchema),z.lazy(() => ContestChallengeUncheckedUpdateWithoutChallengeInputSchema) ]),
}).strict() as z.ZodType<Prisma.ContestChallengeUpdateWithWhereUniqueWithoutChallengeInput>;

export const ContestChallengeUpdateManyWithWhereWithoutChallengeInputSchema: z.ZodType<Prisma.ContestChallengeUpdateManyWithWhereWithoutChallengeInput> = z.object({
  where: z.lazy(() => ContestChallengeScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ContestChallengeUpdateManyMutationInputSchema),z.lazy(() => ContestChallengeUncheckedUpdateManyWithoutChallengeInputSchema) ]),
}).strict() as z.ZodType<Prisma.ContestChallengeUpdateManyWithWhereWithoutChallengeInput>;

export const TestUpsertWithWhereUniqueWithoutChallengeInputSchema: z.ZodType<Prisma.TestUpsertWithWhereUniqueWithoutChallengeInput> = z.object({
  where: z.lazy(() => TestWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TestUpdateWithoutChallengeInputSchema),z.lazy(() => TestUncheckedUpdateWithoutChallengeInputSchema) ]),
  create: z.union([ z.lazy(() => TestCreateWithoutChallengeInputSchema),z.lazy(() => TestUncheckedCreateWithoutChallengeInputSchema) ]),
}).strict() as z.ZodType<Prisma.TestUpsertWithWhereUniqueWithoutChallengeInput>;

export const TestUpdateWithWhereUniqueWithoutChallengeInputSchema: z.ZodType<Prisma.TestUpdateWithWhereUniqueWithoutChallengeInput> = z.object({
  where: z.lazy(() => TestWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TestUpdateWithoutChallengeInputSchema),z.lazy(() => TestUncheckedUpdateWithoutChallengeInputSchema) ]),
}).strict() as z.ZodType<Prisma.TestUpdateWithWhereUniqueWithoutChallengeInput>;

export const TestUpdateManyWithWhereWithoutChallengeInputSchema: z.ZodType<Prisma.TestUpdateManyWithWhereWithoutChallengeInput> = z.object({
  where: z.lazy(() => TestScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TestUpdateManyMutationInputSchema),z.lazy(() => TestUncheckedUpdateManyWithoutChallengeInputSchema) ]),
}).strict() as z.ZodType<Prisma.TestUpdateManyWithWhereWithoutChallengeInput>;

export const TestScalarWhereInputSchema: z.ZodType<Prisma.TestScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TestScalarWhereInputSchema),z.lazy(() => TestScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TestScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TestScalarWhereInputSchema),z.lazy(() => TestScalarWhereInputSchema).array() ]).optional(),
  test_number: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  is_example: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  challenge_id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  task_number: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  comment: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  explanation: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  input: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  output: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict() as z.ZodType<Prisma.TestScalarWhereInput>;

export const ChallengeCreateWithoutTasksInputSchema: z.ZodType<Prisma.ChallengeCreateWithoutTasksInput> = z.object({
  id: z.string(),
  title: z.string(),
  type: z.string(),
  description: z.string(),
  input_format: z.string(),
  output_format: z.string(),
  time_limit: z.number().int(),
  memory_limit: z.number().int(),
  contests: z.lazy(() => ContestChallengeCreateNestedManyWithoutChallengeInputSchema).optional(),
  tests: z.lazy(() => TestCreateNestedManyWithoutChallengeInputSchema).optional()
}).strict() as z.ZodType<Prisma.ChallengeCreateWithoutTasksInput>;

export const ChallengeUncheckedCreateWithoutTasksInputSchema: z.ZodType<Prisma.ChallengeUncheckedCreateWithoutTasksInput> = z.object({
  id: z.string(),
  title: z.string(),
  type: z.string(),
  description: z.string(),
  input_format: z.string(),
  output_format: z.string(),
  time_limit: z.number().int(),
  memory_limit: z.number().int(),
  contests: z.lazy(() => ContestChallengeUncheckedCreateNestedManyWithoutChallengeInputSchema).optional(),
  tests: z.lazy(() => TestUncheckedCreateNestedManyWithoutChallengeInputSchema).optional()
}).strict() as z.ZodType<Prisma.ChallengeUncheckedCreateWithoutTasksInput>;

export const ChallengeCreateOrConnectWithoutTasksInputSchema: z.ZodType<Prisma.ChallengeCreateOrConnectWithoutTasksInput> = z.object({
  where: z.lazy(() => ChallengeWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ChallengeCreateWithoutTasksInputSchema),z.lazy(() => ChallengeUncheckedCreateWithoutTasksInputSchema) ]),
}).strict() as z.ZodType<Prisma.ChallengeCreateOrConnectWithoutTasksInput>;

export const TestCreateWithoutTaskInputSchema: z.ZodType<Prisma.TestCreateWithoutTaskInput> = z.object({
  test_number: z.number().int(),
  is_example: z.boolean(),
  comment: z.string(),
  explanation: z.string(),
  input: z.string(),
  output: z.string(),
  challenge: z.lazy(() => ChallengeCreateNestedOneWithoutTestsInputSchema),
  Result: z.lazy(() => ResultCreateNestedManyWithoutTestInputSchema).optional()
}).strict() as z.ZodType<Prisma.TestCreateWithoutTaskInput>;

export const TestUncheckedCreateWithoutTaskInputSchema: z.ZodType<Prisma.TestUncheckedCreateWithoutTaskInput> = z.object({
  test_number: z.number().int(),
  is_example: z.boolean(),
  comment: z.string(),
  explanation: z.string(),
  input: z.string(),
  output: z.string(),
  Result: z.lazy(() => ResultUncheckedCreateNestedManyWithoutTestInputSchema).optional()
}).strict() as z.ZodType<Prisma.TestUncheckedCreateWithoutTaskInput>;

export const TestCreateOrConnectWithoutTaskInputSchema: z.ZodType<Prisma.TestCreateOrConnectWithoutTaskInput> = z.object({
  where: z.lazy(() => TestWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TestCreateWithoutTaskInputSchema),z.lazy(() => TestUncheckedCreateWithoutTaskInputSchema) ]),
}).strict() as z.ZodType<Prisma.TestCreateOrConnectWithoutTaskInput>;

export const ResultCreateWithoutTaskInputSchema: z.ZodType<Prisma.ResultCreateWithoutTaskInput> = z.object({
  token: z.string(),
  time: z.number(),
  memory: z.number().int(),
  status: z.string(),
  compile_output: z.string(),
  submission: z.lazy(() => SubmissionCreateNestedOneWithoutResultsInputSchema),
  test: z.lazy(() => TestCreateNestedOneWithoutResultInputSchema)
}).strict() as z.ZodType<Prisma.ResultCreateWithoutTaskInput>;

export const ResultUncheckedCreateWithoutTaskInputSchema: z.ZodType<Prisma.ResultUncheckedCreateWithoutTaskInput> = z.object({
  submission_token: z.string(),
  test_number: z.number().int(),
  token: z.string(),
  time: z.number(),
  memory: z.number().int(),
  status: z.string(),
  compile_output: z.string()
}).strict() as z.ZodType<Prisma.ResultUncheckedCreateWithoutTaskInput>;

export const ResultCreateOrConnectWithoutTaskInputSchema: z.ZodType<Prisma.ResultCreateOrConnectWithoutTaskInput> = z.object({
  where: z.lazy(() => ResultWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ResultCreateWithoutTaskInputSchema),z.lazy(() => ResultUncheckedCreateWithoutTaskInputSchema) ]),
}).strict() as z.ZodType<Prisma.ResultCreateOrConnectWithoutTaskInput>;

export const ChallengeUpsertWithoutTasksInputSchema: z.ZodType<Prisma.ChallengeUpsertWithoutTasksInput> = z.object({
  update: z.union([ z.lazy(() => ChallengeUpdateWithoutTasksInputSchema),z.lazy(() => ChallengeUncheckedUpdateWithoutTasksInputSchema) ]),
  create: z.union([ z.lazy(() => ChallengeCreateWithoutTasksInputSchema),z.lazy(() => ChallengeUncheckedCreateWithoutTasksInputSchema) ]),
  where: z.lazy(() => ChallengeWhereInputSchema).optional()
}).strict() as z.ZodType<Prisma.ChallengeUpsertWithoutTasksInput>;

export const ChallengeUpdateToOneWithWhereWithoutTasksInputSchema: z.ZodType<Prisma.ChallengeUpdateToOneWithWhereWithoutTasksInput> = z.object({
  where: z.lazy(() => ChallengeWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ChallengeUpdateWithoutTasksInputSchema),z.lazy(() => ChallengeUncheckedUpdateWithoutTasksInputSchema) ]),
}).strict() as z.ZodType<Prisma.ChallengeUpdateToOneWithWhereWithoutTasksInput>;

export const ChallengeUpdateWithoutTasksInputSchema: z.ZodType<Prisma.ChallengeUpdateWithoutTasksInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  input_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  output_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time_limit: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  memory_limit: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  contests: z.lazy(() => ContestChallengeUpdateManyWithoutChallengeNestedInputSchema).optional(),
  tests: z.lazy(() => TestUpdateManyWithoutChallengeNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.ChallengeUpdateWithoutTasksInput>;

export const ChallengeUncheckedUpdateWithoutTasksInputSchema: z.ZodType<Prisma.ChallengeUncheckedUpdateWithoutTasksInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  input_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  output_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time_limit: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  memory_limit: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  contests: z.lazy(() => ContestChallengeUncheckedUpdateManyWithoutChallengeNestedInputSchema).optional(),
  tests: z.lazy(() => TestUncheckedUpdateManyWithoutChallengeNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.ChallengeUncheckedUpdateWithoutTasksInput>;

export const TestUpsertWithWhereUniqueWithoutTaskInputSchema: z.ZodType<Prisma.TestUpsertWithWhereUniqueWithoutTaskInput> = z.object({
  where: z.lazy(() => TestWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TestUpdateWithoutTaskInputSchema),z.lazy(() => TestUncheckedUpdateWithoutTaskInputSchema) ]),
  create: z.union([ z.lazy(() => TestCreateWithoutTaskInputSchema),z.lazy(() => TestUncheckedCreateWithoutTaskInputSchema) ]),
}).strict() as z.ZodType<Prisma.TestUpsertWithWhereUniqueWithoutTaskInput>;

export const TestUpdateWithWhereUniqueWithoutTaskInputSchema: z.ZodType<Prisma.TestUpdateWithWhereUniqueWithoutTaskInput> = z.object({
  where: z.lazy(() => TestWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TestUpdateWithoutTaskInputSchema),z.lazy(() => TestUncheckedUpdateWithoutTaskInputSchema) ]),
}).strict() as z.ZodType<Prisma.TestUpdateWithWhereUniqueWithoutTaskInput>;

export const TestUpdateManyWithWhereWithoutTaskInputSchema: z.ZodType<Prisma.TestUpdateManyWithWhereWithoutTaskInput> = z.object({
  where: z.lazy(() => TestScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TestUpdateManyMutationInputSchema),z.lazy(() => TestUncheckedUpdateManyWithoutTaskInputSchema) ]),
}).strict() as z.ZodType<Prisma.TestUpdateManyWithWhereWithoutTaskInput>;

export const ResultUpsertWithWhereUniqueWithoutTaskInputSchema: z.ZodType<Prisma.ResultUpsertWithWhereUniqueWithoutTaskInput> = z.object({
  where: z.lazy(() => ResultWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ResultUpdateWithoutTaskInputSchema),z.lazy(() => ResultUncheckedUpdateWithoutTaskInputSchema) ]),
  create: z.union([ z.lazy(() => ResultCreateWithoutTaskInputSchema),z.lazy(() => ResultUncheckedCreateWithoutTaskInputSchema) ]),
}).strict() as z.ZodType<Prisma.ResultUpsertWithWhereUniqueWithoutTaskInput>;

export const ResultUpdateWithWhereUniqueWithoutTaskInputSchema: z.ZodType<Prisma.ResultUpdateWithWhereUniqueWithoutTaskInput> = z.object({
  where: z.lazy(() => ResultWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ResultUpdateWithoutTaskInputSchema),z.lazy(() => ResultUncheckedUpdateWithoutTaskInputSchema) ]),
}).strict() as z.ZodType<Prisma.ResultUpdateWithWhereUniqueWithoutTaskInput>;

export const ResultUpdateManyWithWhereWithoutTaskInputSchema: z.ZodType<Prisma.ResultUpdateManyWithWhereWithoutTaskInput> = z.object({
  where: z.lazy(() => ResultScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ResultUpdateManyMutationInputSchema),z.lazy(() => ResultUncheckedUpdateManyWithoutTaskInputSchema) ]),
}).strict() as z.ZodType<Prisma.ResultUpdateManyWithWhereWithoutTaskInput>;

export const TaskCreateWithoutTestsInputSchema: z.ZodType<Prisma.TaskCreateWithoutTestsInput> = z.object({
  type: z.string(),
  task_number: z.number().int(),
  weight: z.number().int(),
  challenge: z.lazy(() => ChallengeCreateNestedOneWithoutTasksInputSchema),
  Result: z.lazy(() => ResultCreateNestedManyWithoutTaskInputSchema).optional()
}).strict() as z.ZodType<Prisma.TaskCreateWithoutTestsInput>;

export const TaskUncheckedCreateWithoutTestsInputSchema: z.ZodType<Prisma.TaskUncheckedCreateWithoutTestsInput> = z.object({
  challenge_id: z.string(),
  type: z.string(),
  task_number: z.number().int(),
  weight: z.number().int(),
  Result: z.lazy(() => ResultUncheckedCreateNestedManyWithoutTaskInputSchema).optional()
}).strict() as z.ZodType<Prisma.TaskUncheckedCreateWithoutTestsInput>;

export const TaskCreateOrConnectWithoutTestsInputSchema: z.ZodType<Prisma.TaskCreateOrConnectWithoutTestsInput> = z.object({
  where: z.lazy(() => TaskWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TaskCreateWithoutTestsInputSchema),z.lazy(() => TaskUncheckedCreateWithoutTestsInputSchema) ]),
}).strict() as z.ZodType<Prisma.TaskCreateOrConnectWithoutTestsInput>;

export const ChallengeCreateWithoutTestsInputSchema: z.ZodType<Prisma.ChallengeCreateWithoutTestsInput> = z.object({
  id: z.string(),
  title: z.string(),
  type: z.string(),
  description: z.string(),
  input_format: z.string(),
  output_format: z.string(),
  time_limit: z.number().int(),
  memory_limit: z.number().int(),
  tasks: z.lazy(() => TaskCreateNestedManyWithoutChallengeInputSchema).optional(),
  contests: z.lazy(() => ContestChallengeCreateNestedManyWithoutChallengeInputSchema).optional()
}).strict() as z.ZodType<Prisma.ChallengeCreateWithoutTestsInput>;

export const ChallengeUncheckedCreateWithoutTestsInputSchema: z.ZodType<Prisma.ChallengeUncheckedCreateWithoutTestsInput> = z.object({
  id: z.string(),
  title: z.string(),
  type: z.string(),
  description: z.string(),
  input_format: z.string(),
  output_format: z.string(),
  time_limit: z.number().int(),
  memory_limit: z.number().int(),
  tasks: z.lazy(() => TaskUncheckedCreateNestedManyWithoutChallengeInputSchema).optional(),
  contests: z.lazy(() => ContestChallengeUncheckedCreateNestedManyWithoutChallengeInputSchema).optional()
}).strict() as z.ZodType<Prisma.ChallengeUncheckedCreateWithoutTestsInput>;

export const ChallengeCreateOrConnectWithoutTestsInputSchema: z.ZodType<Prisma.ChallengeCreateOrConnectWithoutTestsInput> = z.object({
  where: z.lazy(() => ChallengeWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ChallengeCreateWithoutTestsInputSchema),z.lazy(() => ChallengeUncheckedCreateWithoutTestsInputSchema) ]),
}).strict() as z.ZodType<Prisma.ChallengeCreateOrConnectWithoutTestsInput>;

export const ResultCreateWithoutTestInputSchema: z.ZodType<Prisma.ResultCreateWithoutTestInput> = z.object({
  token: z.string(),
  time: z.number(),
  memory: z.number().int(),
  status: z.string(),
  compile_output: z.string(),
  submission: z.lazy(() => SubmissionCreateNestedOneWithoutResultsInputSchema),
  task: z.lazy(() => TaskCreateNestedOneWithoutResultInputSchema)
}).strict() as z.ZodType<Prisma.ResultCreateWithoutTestInput>;

export const ResultUncheckedCreateWithoutTestInputSchema: z.ZodType<Prisma.ResultUncheckedCreateWithoutTestInput> = z.object({
  submission_token: z.string(),
  token: z.string(),
  time: z.number(),
  memory: z.number().int(),
  status: z.string(),
  compile_output: z.string()
}).strict() as z.ZodType<Prisma.ResultUncheckedCreateWithoutTestInput>;

export const ResultCreateOrConnectWithoutTestInputSchema: z.ZodType<Prisma.ResultCreateOrConnectWithoutTestInput> = z.object({
  where: z.lazy(() => ResultWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ResultCreateWithoutTestInputSchema),z.lazy(() => ResultUncheckedCreateWithoutTestInputSchema) ]),
}).strict() as z.ZodType<Prisma.ResultCreateOrConnectWithoutTestInput>;

export const TaskUpsertWithoutTestsInputSchema: z.ZodType<Prisma.TaskUpsertWithoutTestsInput> = z.object({
  update: z.union([ z.lazy(() => TaskUpdateWithoutTestsInputSchema),z.lazy(() => TaskUncheckedUpdateWithoutTestsInputSchema) ]),
  create: z.union([ z.lazy(() => TaskCreateWithoutTestsInputSchema),z.lazy(() => TaskUncheckedCreateWithoutTestsInputSchema) ]),
  where: z.lazy(() => TaskWhereInputSchema).optional()
}).strict() as z.ZodType<Prisma.TaskUpsertWithoutTestsInput>;

export const TaskUpdateToOneWithWhereWithoutTestsInputSchema: z.ZodType<Prisma.TaskUpdateToOneWithWhereWithoutTestsInput> = z.object({
  where: z.lazy(() => TaskWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => TaskUpdateWithoutTestsInputSchema),z.lazy(() => TaskUncheckedUpdateWithoutTestsInputSchema) ]),
}).strict() as z.ZodType<Prisma.TaskUpdateToOneWithWhereWithoutTestsInput>;

export const TaskUpdateWithoutTestsInputSchema: z.ZodType<Prisma.TaskUpdateWithoutTestsInput> = z.object({
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  task_number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  weight: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  challenge: z.lazy(() => ChallengeUpdateOneRequiredWithoutTasksNestedInputSchema).optional(),
  Result: z.lazy(() => ResultUpdateManyWithoutTaskNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.TaskUpdateWithoutTestsInput>;

export const TaskUncheckedUpdateWithoutTestsInputSchema: z.ZodType<Prisma.TaskUncheckedUpdateWithoutTestsInput> = z.object({
  challenge_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  task_number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  weight: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  Result: z.lazy(() => ResultUncheckedUpdateManyWithoutTaskNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.TaskUncheckedUpdateWithoutTestsInput>;

export const ChallengeUpsertWithoutTestsInputSchema: z.ZodType<Prisma.ChallengeUpsertWithoutTestsInput> = z.object({
  update: z.union([ z.lazy(() => ChallengeUpdateWithoutTestsInputSchema),z.lazy(() => ChallengeUncheckedUpdateWithoutTestsInputSchema) ]),
  create: z.union([ z.lazy(() => ChallengeCreateWithoutTestsInputSchema),z.lazy(() => ChallengeUncheckedCreateWithoutTestsInputSchema) ]),
  where: z.lazy(() => ChallengeWhereInputSchema).optional()
}).strict() as z.ZodType<Prisma.ChallengeUpsertWithoutTestsInput>;

export const ChallengeUpdateToOneWithWhereWithoutTestsInputSchema: z.ZodType<Prisma.ChallengeUpdateToOneWithWhereWithoutTestsInput> = z.object({
  where: z.lazy(() => ChallengeWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ChallengeUpdateWithoutTestsInputSchema),z.lazy(() => ChallengeUncheckedUpdateWithoutTestsInputSchema) ]),
}).strict() as z.ZodType<Prisma.ChallengeUpdateToOneWithWhereWithoutTestsInput>;

export const ChallengeUpdateWithoutTestsInputSchema: z.ZodType<Prisma.ChallengeUpdateWithoutTestsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  input_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  output_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time_limit: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  memory_limit: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  tasks: z.lazy(() => TaskUpdateManyWithoutChallengeNestedInputSchema).optional(),
  contests: z.lazy(() => ContestChallengeUpdateManyWithoutChallengeNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.ChallengeUpdateWithoutTestsInput>;

export const ChallengeUncheckedUpdateWithoutTestsInputSchema: z.ZodType<Prisma.ChallengeUncheckedUpdateWithoutTestsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  input_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  output_format: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time_limit: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  memory_limit: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  tasks: z.lazy(() => TaskUncheckedUpdateManyWithoutChallengeNestedInputSchema).optional(),
  contests: z.lazy(() => ContestChallengeUncheckedUpdateManyWithoutChallengeNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.ChallengeUncheckedUpdateWithoutTestsInput>;

export const ResultUpsertWithWhereUniqueWithoutTestInputSchema: z.ZodType<Prisma.ResultUpsertWithWhereUniqueWithoutTestInput> = z.object({
  where: z.lazy(() => ResultWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ResultUpdateWithoutTestInputSchema),z.lazy(() => ResultUncheckedUpdateWithoutTestInputSchema) ]),
  create: z.union([ z.lazy(() => ResultCreateWithoutTestInputSchema),z.lazy(() => ResultUncheckedCreateWithoutTestInputSchema) ]),
}).strict() as z.ZodType<Prisma.ResultUpsertWithWhereUniqueWithoutTestInput>;

export const ResultUpdateWithWhereUniqueWithoutTestInputSchema: z.ZodType<Prisma.ResultUpdateWithWhereUniqueWithoutTestInput> = z.object({
  where: z.lazy(() => ResultWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ResultUpdateWithoutTestInputSchema),z.lazy(() => ResultUncheckedUpdateWithoutTestInputSchema) ]),
}).strict() as z.ZodType<Prisma.ResultUpdateWithWhereUniqueWithoutTestInput>;

export const ResultUpdateManyWithWhereWithoutTestInputSchema: z.ZodType<Prisma.ResultUpdateManyWithWhereWithoutTestInput> = z.object({
  where: z.lazy(() => ResultScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ResultUpdateManyMutationInputSchema),z.lazy(() => ResultUncheckedUpdateManyWithoutTestInputSchema) ]),
}).strict() as z.ZodType<Prisma.ResultUpdateManyWithWhereWithoutTestInput>;

export const SubmissionUpdateWithoutOwnerInputSchema: z.ZodType<Prisma.SubmissionUpdateWithoutOwnerInput> = z.object({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  src: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  challenge: z.lazy(() => ContestChallengeUpdateOneRequiredWithoutSubmissionsNestedInputSchema).optional(),
  results: z.lazy(() => ResultUpdateManyWithoutSubmissionNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.SubmissionUpdateWithoutOwnerInput>;

export const SubmissionUncheckedUpdateWithoutOwnerInputSchema: z.ZodType<Prisma.SubmissionUncheckedUpdateWithoutOwnerInput> = z.object({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  src: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contest_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  challenge_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  results: z.lazy(() => ResultUncheckedUpdateManyWithoutSubmissionNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.SubmissionUncheckedUpdateWithoutOwnerInput>;

export const SubmissionUncheckedUpdateManyWithoutOwnerInputSchema: z.ZodType<Prisma.SubmissionUncheckedUpdateManyWithoutOwnerInput> = z.object({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  src: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contest_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  challenge_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.SubmissionUncheckedUpdateManyWithoutOwnerInput>;

export const ParticipantUpdateWithoutUserInputSchema: z.ZodType<Prisma.ParticipantUpdateWithoutUserInput> = z.object({
  time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  contest: z.lazy(() => ContestUpdateOneRequiredWithoutParticipantsNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.ParticipantUpdateWithoutUserInput>;

export const ParticipantUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.ParticipantUncheckedUpdateWithoutUserInput> = z.object({
  contest_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ParticipantUncheckedUpdateWithoutUserInput>;

export const ParticipantUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.ParticipantUncheckedUpdateManyWithoutUserInput> = z.object({
  contest_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ParticipantUncheckedUpdateManyWithoutUserInput>;

export const ResultUpdateWithoutSubmissionInputSchema: z.ZodType<Prisma.ResultUpdateWithoutSubmissionInput> = z.object({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  memory: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  compile_output: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  task: z.lazy(() => TaskUpdateOneRequiredWithoutResultNestedInputSchema).optional(),
  test: z.lazy(() => TestUpdateOneRequiredWithoutResultNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.ResultUpdateWithoutSubmissionInput>;

export const ResultUncheckedUpdateWithoutSubmissionInputSchema: z.ZodType<Prisma.ResultUncheckedUpdateWithoutSubmissionInput> = z.object({
  challenge_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  task_number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  test_number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  memory: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  compile_output: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ResultUncheckedUpdateWithoutSubmissionInput>;

export const ResultUncheckedUpdateManyWithoutSubmissionInputSchema: z.ZodType<Prisma.ResultUncheckedUpdateManyWithoutSubmissionInput> = z.object({
  challenge_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  task_number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  test_number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  memory: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  compile_output: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ResultUncheckedUpdateManyWithoutSubmissionInput>;

export const ContestChallengeUpdateWithoutContestInputSchema: z.ZodType<Prisma.ContestChallengeUpdateWithoutContestInput> = z.object({
  max_score: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  challenge: z.lazy(() => ChallengeUpdateOneRequiredWithoutContestsNestedInputSchema).optional(),
  submissions: z.lazy(() => SubmissionUpdateManyWithoutChallengeNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.ContestChallengeUpdateWithoutContestInput>;

export const ContestChallengeUncheckedUpdateWithoutContestInputSchema: z.ZodType<Prisma.ContestChallengeUncheckedUpdateWithoutContestInput> = z.object({
  challenge_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  max_score: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  submissions: z.lazy(() => SubmissionUncheckedUpdateManyWithoutChallengeNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.ContestChallengeUncheckedUpdateWithoutContestInput>;

export const ContestChallengeUncheckedUpdateManyWithoutContestInputSchema: z.ZodType<Prisma.ContestChallengeUncheckedUpdateManyWithoutContestInput> = z.object({
  challenge_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  max_score: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ContestChallengeUncheckedUpdateManyWithoutContestInput>;

export const ParticipantUpdateWithoutContestInputSchema: z.ZodType<Prisma.ParticipantUpdateWithoutContestInput> = z.object({
  time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutParticipantsNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.ParticipantUpdateWithoutContestInput>;

export const ParticipantUncheckedUpdateWithoutContestInputSchema: z.ZodType<Prisma.ParticipantUncheckedUpdateWithoutContestInput> = z.object({
  user_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ParticipantUncheckedUpdateWithoutContestInput>;

export const ParticipantUncheckedUpdateManyWithoutContestInputSchema: z.ZodType<Prisma.ParticipantUncheckedUpdateManyWithoutContestInput> = z.object({
  user_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ParticipantUncheckedUpdateManyWithoutContestInput>;

export const SubmissionUpdateWithoutChallengeInputSchema: z.ZodType<Prisma.SubmissionUpdateWithoutChallengeInput> = z.object({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  src: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  owner: z.lazy(() => UserUpdateOneRequiredWithoutSubmissionsNestedInputSchema).optional(),
  results: z.lazy(() => ResultUpdateManyWithoutSubmissionNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.SubmissionUpdateWithoutChallengeInput>;

export const SubmissionUncheckedUpdateWithoutChallengeInputSchema: z.ZodType<Prisma.SubmissionUncheckedUpdateWithoutChallengeInput> = z.object({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  owner_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  src: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  results: z.lazy(() => ResultUncheckedUpdateManyWithoutSubmissionNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.SubmissionUncheckedUpdateWithoutChallengeInput>;

export const SubmissionUncheckedUpdateManyWithoutChallengeInputSchema: z.ZodType<Prisma.SubmissionUncheckedUpdateManyWithoutChallengeInput> = z.object({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  owner_id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  src: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  score: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  time: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.SubmissionUncheckedUpdateManyWithoutChallengeInput>;

export const TaskUpdateWithoutChallengeInputSchema: z.ZodType<Prisma.TaskUpdateWithoutChallengeInput> = z.object({
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  task_number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  weight: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  tests: z.lazy(() => TestUpdateManyWithoutTaskNestedInputSchema).optional(),
  Result: z.lazy(() => ResultUpdateManyWithoutTaskNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.TaskUpdateWithoutChallengeInput>;

export const TaskUncheckedUpdateWithoutChallengeInputSchema: z.ZodType<Prisma.TaskUncheckedUpdateWithoutChallengeInput> = z.object({
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  task_number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  weight: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  tests: z.lazy(() => TestUncheckedUpdateManyWithoutTaskNestedInputSchema).optional(),
  Result: z.lazy(() => ResultUncheckedUpdateManyWithoutTaskNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.TaskUncheckedUpdateWithoutChallengeInput>;

export const TaskUncheckedUpdateManyWithoutChallengeInputSchema: z.ZodType<Prisma.TaskUncheckedUpdateManyWithoutChallengeInput> = z.object({
  type: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  task_number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  weight: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.TaskUncheckedUpdateManyWithoutChallengeInput>;

export const ContestChallengeUpdateWithoutChallengeInputSchema: z.ZodType<Prisma.ContestChallengeUpdateWithoutChallengeInput> = z.object({
  max_score: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  contest: z.lazy(() => ContestUpdateOneRequiredWithoutChallengesNestedInputSchema).optional(),
  submissions: z.lazy(() => SubmissionUpdateManyWithoutChallengeNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.ContestChallengeUpdateWithoutChallengeInput>;

export const ContestChallengeUncheckedUpdateWithoutChallengeInputSchema: z.ZodType<Prisma.ContestChallengeUncheckedUpdateWithoutChallengeInput> = z.object({
  contest_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  max_score: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  submissions: z.lazy(() => SubmissionUncheckedUpdateManyWithoutChallengeNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.ContestChallengeUncheckedUpdateWithoutChallengeInput>;

export const ContestChallengeUncheckedUpdateManyWithoutChallengeInputSchema: z.ZodType<Prisma.ContestChallengeUncheckedUpdateManyWithoutChallengeInput> = z.object({
  contest_id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  max_score: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ContestChallengeUncheckedUpdateManyWithoutChallengeInput>;

export const TestUpdateWithoutChallengeInputSchema: z.ZodType<Prisma.TestUpdateWithoutChallengeInput> = z.object({
  test_number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  is_example: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  comment: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  explanation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  input: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  output: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  task: z.lazy(() => TaskUpdateOneRequiredWithoutTestsNestedInputSchema).optional(),
  Result: z.lazy(() => ResultUpdateManyWithoutTestNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.TestUpdateWithoutChallengeInput>;

export const TestUncheckedUpdateWithoutChallengeInputSchema: z.ZodType<Prisma.TestUncheckedUpdateWithoutChallengeInput> = z.object({
  test_number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  is_example: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  task_number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  comment: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  explanation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  input: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  output: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Result: z.lazy(() => ResultUncheckedUpdateManyWithoutTestNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.TestUncheckedUpdateWithoutChallengeInput>;

export const TestUncheckedUpdateManyWithoutChallengeInputSchema: z.ZodType<Prisma.TestUncheckedUpdateManyWithoutChallengeInput> = z.object({
  test_number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  is_example: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  task_number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  comment: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  explanation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  input: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  output: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.TestUncheckedUpdateManyWithoutChallengeInput>;

export const TestUpdateWithoutTaskInputSchema: z.ZodType<Prisma.TestUpdateWithoutTaskInput> = z.object({
  test_number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  is_example: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  comment: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  explanation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  input: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  output: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  challenge: z.lazy(() => ChallengeUpdateOneRequiredWithoutTestsNestedInputSchema).optional(),
  Result: z.lazy(() => ResultUpdateManyWithoutTestNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.TestUpdateWithoutTaskInput>;

export const TestUncheckedUpdateWithoutTaskInputSchema: z.ZodType<Prisma.TestUncheckedUpdateWithoutTaskInput> = z.object({
  test_number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  is_example: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  comment: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  explanation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  input: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  output: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  Result: z.lazy(() => ResultUncheckedUpdateManyWithoutTestNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.TestUncheckedUpdateWithoutTaskInput>;

export const TestUncheckedUpdateManyWithoutTaskInputSchema: z.ZodType<Prisma.TestUncheckedUpdateManyWithoutTaskInput> = z.object({
  test_number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  is_example: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  comment: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  explanation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  input: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  output: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.TestUncheckedUpdateManyWithoutTaskInput>;

export const ResultUpdateWithoutTaskInputSchema: z.ZodType<Prisma.ResultUpdateWithoutTaskInput> = z.object({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  memory: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  compile_output: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  submission: z.lazy(() => SubmissionUpdateOneRequiredWithoutResultsNestedInputSchema).optional(),
  test: z.lazy(() => TestUpdateOneRequiredWithoutResultNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.ResultUpdateWithoutTaskInput>;

export const ResultUncheckedUpdateWithoutTaskInputSchema: z.ZodType<Prisma.ResultUncheckedUpdateWithoutTaskInput> = z.object({
  submission_token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  test_number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  memory: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  compile_output: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ResultUncheckedUpdateWithoutTaskInput>;

export const ResultUncheckedUpdateManyWithoutTaskInputSchema: z.ZodType<Prisma.ResultUncheckedUpdateManyWithoutTaskInput> = z.object({
  submission_token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  test_number: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  memory: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  compile_output: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ResultUncheckedUpdateManyWithoutTaskInput>;

export const ResultUpdateWithoutTestInputSchema: z.ZodType<Prisma.ResultUpdateWithoutTestInput> = z.object({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  memory: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  compile_output: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  submission: z.lazy(() => SubmissionUpdateOneRequiredWithoutResultsNestedInputSchema).optional(),
  task: z.lazy(() => TaskUpdateOneRequiredWithoutResultNestedInputSchema).optional()
}).strict() as z.ZodType<Prisma.ResultUpdateWithoutTestInput>;

export const ResultUncheckedUpdateWithoutTestInputSchema: z.ZodType<Prisma.ResultUncheckedUpdateWithoutTestInput> = z.object({
  submission_token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  memory: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  compile_output: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ResultUncheckedUpdateWithoutTestInput>;

export const ResultUncheckedUpdateManyWithoutTestInputSchema: z.ZodType<Prisma.ResultUncheckedUpdateManyWithoutTestInput> = z.object({
  submission_token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  time: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  memory: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  compile_output: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict() as z.ZodType<Prisma.ResultUncheckedUpdateManyWithoutTestInput>;

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.UserFindFirstArgs>;

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.UserFindFirstOrThrowArgs>;

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.UserFindManyArgs>;

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() as z.ZodType<Prisma.UserAggregateArgs>;

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(),UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() as z.ZodType<Prisma.UserGroupByArgs>;

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.UserFindUniqueArgs>;

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.UserFindUniqueOrThrowArgs>;

export const SubmissionFindFirstArgsSchema: z.ZodType<Prisma.SubmissionFindFirstArgs> = z.object({
  select: SubmissionSelectSchema.optional(),
  include: SubmissionIncludeSchema.optional(),
  where: SubmissionWhereInputSchema.optional(),
  orderBy: z.union([ SubmissionOrderByWithRelationInputSchema.array(),SubmissionOrderByWithRelationInputSchema ]).optional(),
  cursor: SubmissionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SubmissionScalarFieldEnumSchema,SubmissionScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.SubmissionFindFirstArgs>;

export const SubmissionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.SubmissionFindFirstOrThrowArgs> = z.object({
  select: SubmissionSelectSchema.optional(),
  include: SubmissionIncludeSchema.optional(),
  where: SubmissionWhereInputSchema.optional(),
  orderBy: z.union([ SubmissionOrderByWithRelationInputSchema.array(),SubmissionOrderByWithRelationInputSchema ]).optional(),
  cursor: SubmissionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SubmissionScalarFieldEnumSchema,SubmissionScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.SubmissionFindFirstOrThrowArgs>;

export const SubmissionFindManyArgsSchema: z.ZodType<Prisma.SubmissionFindManyArgs> = z.object({
  select: SubmissionSelectSchema.optional(),
  include: SubmissionIncludeSchema.optional(),
  where: SubmissionWhereInputSchema.optional(),
  orderBy: z.union([ SubmissionOrderByWithRelationInputSchema.array(),SubmissionOrderByWithRelationInputSchema ]).optional(),
  cursor: SubmissionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SubmissionScalarFieldEnumSchema,SubmissionScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.SubmissionFindManyArgs>;

export const SubmissionAggregateArgsSchema: z.ZodType<Prisma.SubmissionAggregateArgs> = z.object({
  where: SubmissionWhereInputSchema.optional(),
  orderBy: z.union([ SubmissionOrderByWithRelationInputSchema.array(),SubmissionOrderByWithRelationInputSchema ]).optional(),
  cursor: SubmissionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() as z.ZodType<Prisma.SubmissionAggregateArgs>;

export const SubmissionGroupByArgsSchema: z.ZodType<Prisma.SubmissionGroupByArgs> = z.object({
  where: SubmissionWhereInputSchema.optional(),
  orderBy: z.union([ SubmissionOrderByWithAggregationInputSchema.array(),SubmissionOrderByWithAggregationInputSchema ]).optional(),
  by: SubmissionScalarFieldEnumSchema.array(),
  having: SubmissionScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() as z.ZodType<Prisma.SubmissionGroupByArgs>;

export const SubmissionFindUniqueArgsSchema: z.ZodType<Prisma.SubmissionFindUniqueArgs> = z.object({
  select: SubmissionSelectSchema.optional(),
  include: SubmissionIncludeSchema.optional(),
  where: SubmissionWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.SubmissionFindUniqueArgs>;

export const SubmissionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.SubmissionFindUniqueOrThrowArgs> = z.object({
  select: SubmissionSelectSchema.optional(),
  include: SubmissionIncludeSchema.optional(),
  where: SubmissionWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.SubmissionFindUniqueOrThrowArgs>;

export const ResultFindFirstArgsSchema: z.ZodType<Prisma.ResultFindFirstArgs> = z.object({
  select: ResultSelectSchema.optional(),
  include: ResultIncludeSchema.optional(),
  where: ResultWhereInputSchema.optional(),
  orderBy: z.union([ ResultOrderByWithRelationInputSchema.array(),ResultOrderByWithRelationInputSchema ]).optional(),
  cursor: ResultWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ResultScalarFieldEnumSchema,ResultScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.ResultFindFirstArgs>;

export const ResultFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ResultFindFirstOrThrowArgs> = z.object({
  select: ResultSelectSchema.optional(),
  include: ResultIncludeSchema.optional(),
  where: ResultWhereInputSchema.optional(),
  orderBy: z.union([ ResultOrderByWithRelationInputSchema.array(),ResultOrderByWithRelationInputSchema ]).optional(),
  cursor: ResultWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ResultScalarFieldEnumSchema,ResultScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.ResultFindFirstOrThrowArgs>;

export const ResultFindManyArgsSchema: z.ZodType<Prisma.ResultFindManyArgs> = z.object({
  select: ResultSelectSchema.optional(),
  include: ResultIncludeSchema.optional(),
  where: ResultWhereInputSchema.optional(),
  orderBy: z.union([ ResultOrderByWithRelationInputSchema.array(),ResultOrderByWithRelationInputSchema ]).optional(),
  cursor: ResultWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ResultScalarFieldEnumSchema,ResultScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.ResultFindManyArgs>;

export const ResultAggregateArgsSchema: z.ZodType<Prisma.ResultAggregateArgs> = z.object({
  where: ResultWhereInputSchema.optional(),
  orderBy: z.union([ ResultOrderByWithRelationInputSchema.array(),ResultOrderByWithRelationInputSchema ]).optional(),
  cursor: ResultWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() as z.ZodType<Prisma.ResultAggregateArgs>;

export const ResultGroupByArgsSchema: z.ZodType<Prisma.ResultGroupByArgs> = z.object({
  where: ResultWhereInputSchema.optional(),
  orderBy: z.union([ ResultOrderByWithAggregationInputSchema.array(),ResultOrderByWithAggregationInputSchema ]).optional(),
  by: ResultScalarFieldEnumSchema.array(),
  having: ResultScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() as z.ZodType<Prisma.ResultGroupByArgs>;

export const ResultFindUniqueArgsSchema: z.ZodType<Prisma.ResultFindUniqueArgs> = z.object({
  select: ResultSelectSchema.optional(),
  include: ResultIncludeSchema.optional(),
  where: ResultWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.ResultFindUniqueArgs>;

export const ResultFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ResultFindUniqueOrThrowArgs> = z.object({
  select: ResultSelectSchema.optional(),
  include: ResultIncludeSchema.optional(),
  where: ResultWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.ResultFindUniqueOrThrowArgs>;

export const ParticipantFindFirstArgsSchema: z.ZodType<Prisma.ParticipantFindFirstArgs> = z.object({
  select: ParticipantSelectSchema.optional(),
  include: ParticipantIncludeSchema.optional(),
  where: ParticipantWhereInputSchema.optional(),
  orderBy: z.union([ ParticipantOrderByWithRelationInputSchema.array(),ParticipantOrderByWithRelationInputSchema ]).optional(),
  cursor: ParticipantWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ParticipantScalarFieldEnumSchema,ParticipantScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.ParticipantFindFirstArgs>;

export const ParticipantFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ParticipantFindFirstOrThrowArgs> = z.object({
  select: ParticipantSelectSchema.optional(),
  include: ParticipantIncludeSchema.optional(),
  where: ParticipantWhereInputSchema.optional(),
  orderBy: z.union([ ParticipantOrderByWithRelationInputSchema.array(),ParticipantOrderByWithRelationInputSchema ]).optional(),
  cursor: ParticipantWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ParticipantScalarFieldEnumSchema,ParticipantScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.ParticipantFindFirstOrThrowArgs>;

export const ParticipantFindManyArgsSchema: z.ZodType<Prisma.ParticipantFindManyArgs> = z.object({
  select: ParticipantSelectSchema.optional(),
  include: ParticipantIncludeSchema.optional(),
  where: ParticipantWhereInputSchema.optional(),
  orderBy: z.union([ ParticipantOrderByWithRelationInputSchema.array(),ParticipantOrderByWithRelationInputSchema ]).optional(),
  cursor: ParticipantWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ParticipantScalarFieldEnumSchema,ParticipantScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.ParticipantFindManyArgs>;

export const ParticipantAggregateArgsSchema: z.ZodType<Prisma.ParticipantAggregateArgs> = z.object({
  where: ParticipantWhereInputSchema.optional(),
  orderBy: z.union([ ParticipantOrderByWithRelationInputSchema.array(),ParticipantOrderByWithRelationInputSchema ]).optional(),
  cursor: ParticipantWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() as z.ZodType<Prisma.ParticipantAggregateArgs>;

export const ParticipantGroupByArgsSchema: z.ZodType<Prisma.ParticipantGroupByArgs> = z.object({
  where: ParticipantWhereInputSchema.optional(),
  orderBy: z.union([ ParticipantOrderByWithAggregationInputSchema.array(),ParticipantOrderByWithAggregationInputSchema ]).optional(),
  by: ParticipantScalarFieldEnumSchema.array(),
  having: ParticipantScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() as z.ZodType<Prisma.ParticipantGroupByArgs>;

export const ParticipantFindUniqueArgsSchema: z.ZodType<Prisma.ParticipantFindUniqueArgs> = z.object({
  select: ParticipantSelectSchema.optional(),
  include: ParticipantIncludeSchema.optional(),
  where: ParticipantWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.ParticipantFindUniqueArgs>;

export const ParticipantFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ParticipantFindUniqueOrThrowArgs> = z.object({
  select: ParticipantSelectSchema.optional(),
  include: ParticipantIncludeSchema.optional(),
  where: ParticipantWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.ParticipantFindUniqueOrThrowArgs>;

export const ContestFindFirstArgsSchema: z.ZodType<Prisma.ContestFindFirstArgs> = z.object({
  select: ContestSelectSchema.optional(),
  include: ContestIncludeSchema.optional(),
  where: ContestWhereInputSchema.optional(),
  orderBy: z.union([ ContestOrderByWithRelationInputSchema.array(),ContestOrderByWithRelationInputSchema ]).optional(),
  cursor: ContestWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContestScalarFieldEnumSchema,ContestScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.ContestFindFirstArgs>;

export const ContestFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ContestFindFirstOrThrowArgs> = z.object({
  select: ContestSelectSchema.optional(),
  include: ContestIncludeSchema.optional(),
  where: ContestWhereInputSchema.optional(),
  orderBy: z.union([ ContestOrderByWithRelationInputSchema.array(),ContestOrderByWithRelationInputSchema ]).optional(),
  cursor: ContestWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContestScalarFieldEnumSchema,ContestScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.ContestFindFirstOrThrowArgs>;

export const ContestFindManyArgsSchema: z.ZodType<Prisma.ContestFindManyArgs> = z.object({
  select: ContestSelectSchema.optional(),
  include: ContestIncludeSchema.optional(),
  where: ContestWhereInputSchema.optional(),
  orderBy: z.union([ ContestOrderByWithRelationInputSchema.array(),ContestOrderByWithRelationInputSchema ]).optional(),
  cursor: ContestWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContestScalarFieldEnumSchema,ContestScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.ContestFindManyArgs>;

export const ContestAggregateArgsSchema: z.ZodType<Prisma.ContestAggregateArgs> = z.object({
  where: ContestWhereInputSchema.optional(),
  orderBy: z.union([ ContestOrderByWithRelationInputSchema.array(),ContestOrderByWithRelationInputSchema ]).optional(),
  cursor: ContestWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() as z.ZodType<Prisma.ContestAggregateArgs>;

export const ContestGroupByArgsSchema: z.ZodType<Prisma.ContestGroupByArgs> = z.object({
  where: ContestWhereInputSchema.optional(),
  orderBy: z.union([ ContestOrderByWithAggregationInputSchema.array(),ContestOrderByWithAggregationInputSchema ]).optional(),
  by: ContestScalarFieldEnumSchema.array(),
  having: ContestScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() as z.ZodType<Prisma.ContestGroupByArgs>;

export const ContestFindUniqueArgsSchema: z.ZodType<Prisma.ContestFindUniqueArgs> = z.object({
  select: ContestSelectSchema.optional(),
  include: ContestIncludeSchema.optional(),
  where: ContestWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.ContestFindUniqueArgs>;

export const ContestFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ContestFindUniqueOrThrowArgs> = z.object({
  select: ContestSelectSchema.optional(),
  include: ContestIncludeSchema.optional(),
  where: ContestWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.ContestFindUniqueOrThrowArgs>;

export const ContestChallengeFindFirstArgsSchema: z.ZodType<Prisma.ContestChallengeFindFirstArgs> = z.object({
  select: ContestChallengeSelectSchema.optional(),
  include: ContestChallengeIncludeSchema.optional(),
  where: ContestChallengeWhereInputSchema.optional(),
  orderBy: z.union([ ContestChallengeOrderByWithRelationInputSchema.array(),ContestChallengeOrderByWithRelationInputSchema ]).optional(),
  cursor: ContestChallengeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContestChallengeScalarFieldEnumSchema,ContestChallengeScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.ContestChallengeFindFirstArgs>;

export const ContestChallengeFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ContestChallengeFindFirstOrThrowArgs> = z.object({
  select: ContestChallengeSelectSchema.optional(),
  include: ContestChallengeIncludeSchema.optional(),
  where: ContestChallengeWhereInputSchema.optional(),
  orderBy: z.union([ ContestChallengeOrderByWithRelationInputSchema.array(),ContestChallengeOrderByWithRelationInputSchema ]).optional(),
  cursor: ContestChallengeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContestChallengeScalarFieldEnumSchema,ContestChallengeScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.ContestChallengeFindFirstOrThrowArgs>;

export const ContestChallengeFindManyArgsSchema: z.ZodType<Prisma.ContestChallengeFindManyArgs> = z.object({
  select: ContestChallengeSelectSchema.optional(),
  include: ContestChallengeIncludeSchema.optional(),
  where: ContestChallengeWhereInputSchema.optional(),
  orderBy: z.union([ ContestChallengeOrderByWithRelationInputSchema.array(),ContestChallengeOrderByWithRelationInputSchema ]).optional(),
  cursor: ContestChallengeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContestChallengeScalarFieldEnumSchema,ContestChallengeScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.ContestChallengeFindManyArgs>;

export const ContestChallengeAggregateArgsSchema: z.ZodType<Prisma.ContestChallengeAggregateArgs> = z.object({
  where: ContestChallengeWhereInputSchema.optional(),
  orderBy: z.union([ ContestChallengeOrderByWithRelationInputSchema.array(),ContestChallengeOrderByWithRelationInputSchema ]).optional(),
  cursor: ContestChallengeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() as z.ZodType<Prisma.ContestChallengeAggregateArgs>;

export const ContestChallengeGroupByArgsSchema: z.ZodType<Prisma.ContestChallengeGroupByArgs> = z.object({
  where: ContestChallengeWhereInputSchema.optional(),
  orderBy: z.union([ ContestChallengeOrderByWithAggregationInputSchema.array(),ContestChallengeOrderByWithAggregationInputSchema ]).optional(),
  by: ContestChallengeScalarFieldEnumSchema.array(),
  having: ContestChallengeScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() as z.ZodType<Prisma.ContestChallengeGroupByArgs>;

export const ContestChallengeFindUniqueArgsSchema: z.ZodType<Prisma.ContestChallengeFindUniqueArgs> = z.object({
  select: ContestChallengeSelectSchema.optional(),
  include: ContestChallengeIncludeSchema.optional(),
  where: ContestChallengeWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.ContestChallengeFindUniqueArgs>;

export const ContestChallengeFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ContestChallengeFindUniqueOrThrowArgs> = z.object({
  select: ContestChallengeSelectSchema.optional(),
  include: ContestChallengeIncludeSchema.optional(),
  where: ContestChallengeWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.ContestChallengeFindUniqueOrThrowArgs>;

export const ChallengeFindFirstArgsSchema: z.ZodType<Prisma.ChallengeFindFirstArgs> = z.object({
  select: ChallengeSelectSchema.optional(),
  include: ChallengeIncludeSchema.optional(),
  where: ChallengeWhereInputSchema.optional(),
  orderBy: z.union([ ChallengeOrderByWithRelationInputSchema.array(),ChallengeOrderByWithRelationInputSchema ]).optional(),
  cursor: ChallengeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ChallengeScalarFieldEnumSchema,ChallengeScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.ChallengeFindFirstArgs>;

export const ChallengeFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ChallengeFindFirstOrThrowArgs> = z.object({
  select: ChallengeSelectSchema.optional(),
  include: ChallengeIncludeSchema.optional(),
  where: ChallengeWhereInputSchema.optional(),
  orderBy: z.union([ ChallengeOrderByWithRelationInputSchema.array(),ChallengeOrderByWithRelationInputSchema ]).optional(),
  cursor: ChallengeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ChallengeScalarFieldEnumSchema,ChallengeScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.ChallengeFindFirstOrThrowArgs>;

export const ChallengeFindManyArgsSchema: z.ZodType<Prisma.ChallengeFindManyArgs> = z.object({
  select: ChallengeSelectSchema.optional(),
  include: ChallengeIncludeSchema.optional(),
  where: ChallengeWhereInputSchema.optional(),
  orderBy: z.union([ ChallengeOrderByWithRelationInputSchema.array(),ChallengeOrderByWithRelationInputSchema ]).optional(),
  cursor: ChallengeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ChallengeScalarFieldEnumSchema,ChallengeScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.ChallengeFindManyArgs>;

export const ChallengeAggregateArgsSchema: z.ZodType<Prisma.ChallengeAggregateArgs> = z.object({
  where: ChallengeWhereInputSchema.optional(),
  orderBy: z.union([ ChallengeOrderByWithRelationInputSchema.array(),ChallengeOrderByWithRelationInputSchema ]).optional(),
  cursor: ChallengeWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() as z.ZodType<Prisma.ChallengeAggregateArgs>;

export const ChallengeGroupByArgsSchema: z.ZodType<Prisma.ChallengeGroupByArgs> = z.object({
  where: ChallengeWhereInputSchema.optional(),
  orderBy: z.union([ ChallengeOrderByWithAggregationInputSchema.array(),ChallengeOrderByWithAggregationInputSchema ]).optional(),
  by: ChallengeScalarFieldEnumSchema.array(),
  having: ChallengeScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() as z.ZodType<Prisma.ChallengeGroupByArgs>;

export const ChallengeFindUniqueArgsSchema: z.ZodType<Prisma.ChallengeFindUniqueArgs> = z.object({
  select: ChallengeSelectSchema.optional(),
  include: ChallengeIncludeSchema.optional(),
  where: ChallengeWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.ChallengeFindUniqueArgs>;

export const ChallengeFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ChallengeFindUniqueOrThrowArgs> = z.object({
  select: ChallengeSelectSchema.optional(),
  include: ChallengeIncludeSchema.optional(),
  where: ChallengeWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.ChallengeFindUniqueOrThrowArgs>;

export const TaskFindFirstArgsSchema: z.ZodType<Prisma.TaskFindFirstArgs> = z.object({
  select: TaskSelectSchema.optional(),
  include: TaskIncludeSchema.optional(),
  where: TaskWhereInputSchema.optional(),
  orderBy: z.union([ TaskOrderByWithRelationInputSchema.array(),TaskOrderByWithRelationInputSchema ]).optional(),
  cursor: TaskWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TaskScalarFieldEnumSchema,TaskScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.TaskFindFirstArgs>;

export const TaskFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TaskFindFirstOrThrowArgs> = z.object({
  select: TaskSelectSchema.optional(),
  include: TaskIncludeSchema.optional(),
  where: TaskWhereInputSchema.optional(),
  orderBy: z.union([ TaskOrderByWithRelationInputSchema.array(),TaskOrderByWithRelationInputSchema ]).optional(),
  cursor: TaskWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TaskScalarFieldEnumSchema,TaskScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.TaskFindFirstOrThrowArgs>;

export const TaskFindManyArgsSchema: z.ZodType<Prisma.TaskFindManyArgs> = z.object({
  select: TaskSelectSchema.optional(),
  include: TaskIncludeSchema.optional(),
  where: TaskWhereInputSchema.optional(),
  orderBy: z.union([ TaskOrderByWithRelationInputSchema.array(),TaskOrderByWithRelationInputSchema ]).optional(),
  cursor: TaskWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TaskScalarFieldEnumSchema,TaskScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.TaskFindManyArgs>;

export const TaskAggregateArgsSchema: z.ZodType<Prisma.TaskAggregateArgs> = z.object({
  where: TaskWhereInputSchema.optional(),
  orderBy: z.union([ TaskOrderByWithRelationInputSchema.array(),TaskOrderByWithRelationInputSchema ]).optional(),
  cursor: TaskWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() as z.ZodType<Prisma.TaskAggregateArgs>;

export const TaskGroupByArgsSchema: z.ZodType<Prisma.TaskGroupByArgs> = z.object({
  where: TaskWhereInputSchema.optional(),
  orderBy: z.union([ TaskOrderByWithAggregationInputSchema.array(),TaskOrderByWithAggregationInputSchema ]).optional(),
  by: TaskScalarFieldEnumSchema.array(),
  having: TaskScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() as z.ZodType<Prisma.TaskGroupByArgs>;

export const TaskFindUniqueArgsSchema: z.ZodType<Prisma.TaskFindUniqueArgs> = z.object({
  select: TaskSelectSchema.optional(),
  include: TaskIncludeSchema.optional(),
  where: TaskWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.TaskFindUniqueArgs>;

export const TaskFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TaskFindUniqueOrThrowArgs> = z.object({
  select: TaskSelectSchema.optional(),
  include: TaskIncludeSchema.optional(),
  where: TaskWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.TaskFindUniqueOrThrowArgs>;

export const TestFindFirstArgsSchema: z.ZodType<Prisma.TestFindFirstArgs> = z.object({
  select: TestSelectSchema.optional(),
  include: TestIncludeSchema.optional(),
  where: TestWhereInputSchema.optional(),
  orderBy: z.union([ TestOrderByWithRelationInputSchema.array(),TestOrderByWithRelationInputSchema ]).optional(),
  cursor: TestWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TestScalarFieldEnumSchema,TestScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.TestFindFirstArgs>;

export const TestFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TestFindFirstOrThrowArgs> = z.object({
  select: TestSelectSchema.optional(),
  include: TestIncludeSchema.optional(),
  where: TestWhereInputSchema.optional(),
  orderBy: z.union([ TestOrderByWithRelationInputSchema.array(),TestOrderByWithRelationInputSchema ]).optional(),
  cursor: TestWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TestScalarFieldEnumSchema,TestScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.TestFindFirstOrThrowArgs>;

export const TestFindManyArgsSchema: z.ZodType<Prisma.TestFindManyArgs> = z.object({
  select: TestSelectSchema.optional(),
  include: TestIncludeSchema.optional(),
  where: TestWhereInputSchema.optional(),
  orderBy: z.union([ TestOrderByWithRelationInputSchema.array(),TestOrderByWithRelationInputSchema ]).optional(),
  cursor: TestWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TestScalarFieldEnumSchema,TestScalarFieldEnumSchema.array() ]).optional(),
}).strict() as z.ZodType<Prisma.TestFindManyArgs>;

export const TestAggregateArgsSchema: z.ZodType<Prisma.TestAggregateArgs> = z.object({
  where: TestWhereInputSchema.optional(),
  orderBy: z.union([ TestOrderByWithRelationInputSchema.array(),TestOrderByWithRelationInputSchema ]).optional(),
  cursor: TestWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() as z.ZodType<Prisma.TestAggregateArgs>;

export const TestGroupByArgsSchema: z.ZodType<Prisma.TestGroupByArgs> = z.object({
  where: TestWhereInputSchema.optional(),
  orderBy: z.union([ TestOrderByWithAggregationInputSchema.array(),TestOrderByWithAggregationInputSchema ]).optional(),
  by: TestScalarFieldEnumSchema.array(),
  having: TestScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() as z.ZodType<Prisma.TestGroupByArgs>;

export const TestFindUniqueArgsSchema: z.ZodType<Prisma.TestFindUniqueArgs> = z.object({
  select: TestSelectSchema.optional(),
  include: TestIncludeSchema.optional(),
  where: TestWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.TestFindUniqueArgs>;

export const TestFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TestFindUniqueOrThrowArgs> = z.object({
  select: TestSelectSchema.optional(),
  include: TestIncludeSchema.optional(),
  where: TestWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.TestFindUniqueOrThrowArgs>;

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
}).strict() as z.ZodType<Prisma.UserCreateArgs>;

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
}).strict() as z.ZodType<Prisma.UserUpsertArgs>;

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.UserDeleteArgs>;

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.UserUpdateArgs>;

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
}).strict() as z.ZodType<Prisma.UserUpdateManyArgs>;

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
}).strict() as z.ZodType<Prisma.UserDeleteManyArgs>;

export const SubmissionCreateArgsSchema: z.ZodType<Prisma.SubmissionCreateArgs> = z.object({
  select: SubmissionSelectSchema.optional(),
  include: SubmissionIncludeSchema.optional(),
  data: z.union([ SubmissionCreateInputSchema,SubmissionUncheckedCreateInputSchema ]),
}).strict() as z.ZodType<Prisma.SubmissionCreateArgs>;

export const SubmissionUpsertArgsSchema: z.ZodType<Prisma.SubmissionUpsertArgs> = z.object({
  select: SubmissionSelectSchema.optional(),
  include: SubmissionIncludeSchema.optional(),
  where: SubmissionWhereUniqueInputSchema,
  create: z.union([ SubmissionCreateInputSchema,SubmissionUncheckedCreateInputSchema ]),
  update: z.union([ SubmissionUpdateInputSchema,SubmissionUncheckedUpdateInputSchema ]),
}).strict() as z.ZodType<Prisma.SubmissionUpsertArgs>;

export const SubmissionDeleteArgsSchema: z.ZodType<Prisma.SubmissionDeleteArgs> = z.object({
  select: SubmissionSelectSchema.optional(),
  include: SubmissionIncludeSchema.optional(),
  where: SubmissionWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.SubmissionDeleteArgs>;

export const SubmissionUpdateArgsSchema: z.ZodType<Prisma.SubmissionUpdateArgs> = z.object({
  select: SubmissionSelectSchema.optional(),
  include: SubmissionIncludeSchema.optional(),
  data: z.union([ SubmissionUpdateInputSchema,SubmissionUncheckedUpdateInputSchema ]),
  where: SubmissionWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.SubmissionUpdateArgs>;

export const SubmissionUpdateManyArgsSchema: z.ZodType<Prisma.SubmissionUpdateManyArgs> = z.object({
  data: z.union([ SubmissionUpdateManyMutationInputSchema,SubmissionUncheckedUpdateManyInputSchema ]),
  where: SubmissionWhereInputSchema.optional(),
}).strict() as z.ZodType<Prisma.SubmissionUpdateManyArgs>;

export const SubmissionDeleteManyArgsSchema: z.ZodType<Prisma.SubmissionDeleteManyArgs> = z.object({
  where: SubmissionWhereInputSchema.optional(),
}).strict() as z.ZodType<Prisma.SubmissionDeleteManyArgs>;

export const ResultCreateArgsSchema: z.ZodType<Prisma.ResultCreateArgs> = z.object({
  select: ResultSelectSchema.optional(),
  include: ResultIncludeSchema.optional(),
  data: z.union([ ResultCreateInputSchema,ResultUncheckedCreateInputSchema ]),
}).strict() as z.ZodType<Prisma.ResultCreateArgs>;

export const ResultUpsertArgsSchema: z.ZodType<Prisma.ResultUpsertArgs> = z.object({
  select: ResultSelectSchema.optional(),
  include: ResultIncludeSchema.optional(),
  where: ResultWhereUniqueInputSchema,
  create: z.union([ ResultCreateInputSchema,ResultUncheckedCreateInputSchema ]),
  update: z.union([ ResultUpdateInputSchema,ResultUncheckedUpdateInputSchema ]),
}).strict() as z.ZodType<Prisma.ResultUpsertArgs>;

export const ResultDeleteArgsSchema: z.ZodType<Prisma.ResultDeleteArgs> = z.object({
  select: ResultSelectSchema.optional(),
  include: ResultIncludeSchema.optional(),
  where: ResultWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.ResultDeleteArgs>;

export const ResultUpdateArgsSchema: z.ZodType<Prisma.ResultUpdateArgs> = z.object({
  select: ResultSelectSchema.optional(),
  include: ResultIncludeSchema.optional(),
  data: z.union([ ResultUpdateInputSchema,ResultUncheckedUpdateInputSchema ]),
  where: ResultWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.ResultUpdateArgs>;

export const ResultUpdateManyArgsSchema: z.ZodType<Prisma.ResultUpdateManyArgs> = z.object({
  data: z.union([ ResultUpdateManyMutationInputSchema,ResultUncheckedUpdateManyInputSchema ]),
  where: ResultWhereInputSchema.optional(),
}).strict() as z.ZodType<Prisma.ResultUpdateManyArgs>;

export const ResultDeleteManyArgsSchema: z.ZodType<Prisma.ResultDeleteManyArgs> = z.object({
  where: ResultWhereInputSchema.optional(),
}).strict() as z.ZodType<Prisma.ResultDeleteManyArgs>;

export const ParticipantCreateArgsSchema: z.ZodType<Prisma.ParticipantCreateArgs> = z.object({
  select: ParticipantSelectSchema.optional(),
  include: ParticipantIncludeSchema.optional(),
  data: z.union([ ParticipantCreateInputSchema,ParticipantUncheckedCreateInputSchema ]),
}).strict() as z.ZodType<Prisma.ParticipantCreateArgs>;

export const ParticipantUpsertArgsSchema: z.ZodType<Prisma.ParticipantUpsertArgs> = z.object({
  select: ParticipantSelectSchema.optional(),
  include: ParticipantIncludeSchema.optional(),
  where: ParticipantWhereUniqueInputSchema,
  create: z.union([ ParticipantCreateInputSchema,ParticipantUncheckedCreateInputSchema ]),
  update: z.union([ ParticipantUpdateInputSchema,ParticipantUncheckedUpdateInputSchema ]),
}).strict() as z.ZodType<Prisma.ParticipantUpsertArgs>;

export const ParticipantDeleteArgsSchema: z.ZodType<Prisma.ParticipantDeleteArgs> = z.object({
  select: ParticipantSelectSchema.optional(),
  include: ParticipantIncludeSchema.optional(),
  where: ParticipantWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.ParticipantDeleteArgs>;

export const ParticipantUpdateArgsSchema: z.ZodType<Prisma.ParticipantUpdateArgs> = z.object({
  select: ParticipantSelectSchema.optional(),
  include: ParticipantIncludeSchema.optional(),
  data: z.union([ ParticipantUpdateInputSchema,ParticipantUncheckedUpdateInputSchema ]),
  where: ParticipantWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.ParticipantUpdateArgs>;

export const ParticipantUpdateManyArgsSchema: z.ZodType<Prisma.ParticipantUpdateManyArgs> = z.object({
  data: z.union([ ParticipantUpdateManyMutationInputSchema,ParticipantUncheckedUpdateManyInputSchema ]),
  where: ParticipantWhereInputSchema.optional(),
}).strict() as z.ZodType<Prisma.ParticipantUpdateManyArgs>;

export const ParticipantDeleteManyArgsSchema: z.ZodType<Prisma.ParticipantDeleteManyArgs> = z.object({
  where: ParticipantWhereInputSchema.optional(),
}).strict() as z.ZodType<Prisma.ParticipantDeleteManyArgs>;

export const ContestCreateArgsSchema: z.ZodType<Prisma.ContestCreateArgs> = z.object({
  select: ContestSelectSchema.optional(),
  include: ContestIncludeSchema.optional(),
  data: z.union([ ContestCreateInputSchema,ContestUncheckedCreateInputSchema ]),
}).strict() as z.ZodType<Prisma.ContestCreateArgs>;

export const ContestUpsertArgsSchema: z.ZodType<Prisma.ContestUpsertArgs> = z.object({
  select: ContestSelectSchema.optional(),
  include: ContestIncludeSchema.optional(),
  where: ContestWhereUniqueInputSchema,
  create: z.union([ ContestCreateInputSchema,ContestUncheckedCreateInputSchema ]),
  update: z.union([ ContestUpdateInputSchema,ContestUncheckedUpdateInputSchema ]),
}).strict() as z.ZodType<Prisma.ContestUpsertArgs>;

export const ContestDeleteArgsSchema: z.ZodType<Prisma.ContestDeleteArgs> = z.object({
  select: ContestSelectSchema.optional(),
  include: ContestIncludeSchema.optional(),
  where: ContestWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.ContestDeleteArgs>;

export const ContestUpdateArgsSchema: z.ZodType<Prisma.ContestUpdateArgs> = z.object({
  select: ContestSelectSchema.optional(),
  include: ContestIncludeSchema.optional(),
  data: z.union([ ContestUpdateInputSchema,ContestUncheckedUpdateInputSchema ]),
  where: ContestWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.ContestUpdateArgs>;

export const ContestUpdateManyArgsSchema: z.ZodType<Prisma.ContestUpdateManyArgs> = z.object({
  data: z.union([ ContestUpdateManyMutationInputSchema,ContestUncheckedUpdateManyInputSchema ]),
  where: ContestWhereInputSchema.optional(),
}).strict() as z.ZodType<Prisma.ContestUpdateManyArgs>;

export const ContestDeleteManyArgsSchema: z.ZodType<Prisma.ContestDeleteManyArgs> = z.object({
  where: ContestWhereInputSchema.optional(),
}).strict() as z.ZodType<Prisma.ContestDeleteManyArgs>;

export const ContestChallengeCreateArgsSchema: z.ZodType<Prisma.ContestChallengeCreateArgs> = z.object({
  select: ContestChallengeSelectSchema.optional(),
  include: ContestChallengeIncludeSchema.optional(),
  data: z.union([ ContestChallengeCreateInputSchema,ContestChallengeUncheckedCreateInputSchema ]),
}).strict() as z.ZodType<Prisma.ContestChallengeCreateArgs>;

export const ContestChallengeUpsertArgsSchema: z.ZodType<Prisma.ContestChallengeUpsertArgs> = z.object({
  select: ContestChallengeSelectSchema.optional(),
  include: ContestChallengeIncludeSchema.optional(),
  where: ContestChallengeWhereUniqueInputSchema,
  create: z.union([ ContestChallengeCreateInputSchema,ContestChallengeUncheckedCreateInputSchema ]),
  update: z.union([ ContestChallengeUpdateInputSchema,ContestChallengeUncheckedUpdateInputSchema ]),
}).strict() as z.ZodType<Prisma.ContestChallengeUpsertArgs>;

export const ContestChallengeDeleteArgsSchema: z.ZodType<Prisma.ContestChallengeDeleteArgs> = z.object({
  select: ContestChallengeSelectSchema.optional(),
  include: ContestChallengeIncludeSchema.optional(),
  where: ContestChallengeWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.ContestChallengeDeleteArgs>;

export const ContestChallengeUpdateArgsSchema: z.ZodType<Prisma.ContestChallengeUpdateArgs> = z.object({
  select: ContestChallengeSelectSchema.optional(),
  include: ContestChallengeIncludeSchema.optional(),
  data: z.union([ ContestChallengeUpdateInputSchema,ContestChallengeUncheckedUpdateInputSchema ]),
  where: ContestChallengeWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.ContestChallengeUpdateArgs>;

export const ContestChallengeUpdateManyArgsSchema: z.ZodType<Prisma.ContestChallengeUpdateManyArgs> = z.object({
  data: z.union([ ContestChallengeUpdateManyMutationInputSchema,ContestChallengeUncheckedUpdateManyInputSchema ]),
  where: ContestChallengeWhereInputSchema.optional(),
}).strict() as z.ZodType<Prisma.ContestChallengeUpdateManyArgs>;

export const ContestChallengeDeleteManyArgsSchema: z.ZodType<Prisma.ContestChallengeDeleteManyArgs> = z.object({
  where: ContestChallengeWhereInputSchema.optional(),
}).strict() as z.ZodType<Prisma.ContestChallengeDeleteManyArgs>;

export const ChallengeCreateArgsSchema: z.ZodType<Prisma.ChallengeCreateArgs> = z.object({
  select: ChallengeSelectSchema.optional(),
  include: ChallengeIncludeSchema.optional(),
  data: z.union([ ChallengeCreateInputSchema,ChallengeUncheckedCreateInputSchema ]),
}).strict() as z.ZodType<Prisma.ChallengeCreateArgs>;

export const ChallengeUpsertArgsSchema: z.ZodType<Prisma.ChallengeUpsertArgs> = z.object({
  select: ChallengeSelectSchema.optional(),
  include: ChallengeIncludeSchema.optional(),
  where: ChallengeWhereUniqueInputSchema,
  create: z.union([ ChallengeCreateInputSchema,ChallengeUncheckedCreateInputSchema ]),
  update: z.union([ ChallengeUpdateInputSchema,ChallengeUncheckedUpdateInputSchema ]),
}).strict() as z.ZodType<Prisma.ChallengeUpsertArgs>;

export const ChallengeDeleteArgsSchema: z.ZodType<Prisma.ChallengeDeleteArgs> = z.object({
  select: ChallengeSelectSchema.optional(),
  include: ChallengeIncludeSchema.optional(),
  where: ChallengeWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.ChallengeDeleteArgs>;

export const ChallengeUpdateArgsSchema: z.ZodType<Prisma.ChallengeUpdateArgs> = z.object({
  select: ChallengeSelectSchema.optional(),
  include: ChallengeIncludeSchema.optional(),
  data: z.union([ ChallengeUpdateInputSchema,ChallengeUncheckedUpdateInputSchema ]),
  where: ChallengeWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.ChallengeUpdateArgs>;

export const ChallengeUpdateManyArgsSchema: z.ZodType<Prisma.ChallengeUpdateManyArgs> = z.object({
  data: z.union([ ChallengeUpdateManyMutationInputSchema,ChallengeUncheckedUpdateManyInputSchema ]),
  where: ChallengeWhereInputSchema.optional(),
}).strict() as z.ZodType<Prisma.ChallengeUpdateManyArgs>;

export const ChallengeDeleteManyArgsSchema: z.ZodType<Prisma.ChallengeDeleteManyArgs> = z.object({
  where: ChallengeWhereInputSchema.optional(),
}).strict() as z.ZodType<Prisma.ChallengeDeleteManyArgs>;

export const TaskCreateArgsSchema: z.ZodType<Prisma.TaskCreateArgs> = z.object({
  select: TaskSelectSchema.optional(),
  include: TaskIncludeSchema.optional(),
  data: z.union([ TaskCreateInputSchema,TaskUncheckedCreateInputSchema ]),
}).strict() as z.ZodType<Prisma.TaskCreateArgs>;

export const TaskUpsertArgsSchema: z.ZodType<Prisma.TaskUpsertArgs> = z.object({
  select: TaskSelectSchema.optional(),
  include: TaskIncludeSchema.optional(),
  where: TaskWhereUniqueInputSchema,
  create: z.union([ TaskCreateInputSchema,TaskUncheckedCreateInputSchema ]),
  update: z.union([ TaskUpdateInputSchema,TaskUncheckedUpdateInputSchema ]),
}).strict() as z.ZodType<Prisma.TaskUpsertArgs>;

export const TaskDeleteArgsSchema: z.ZodType<Prisma.TaskDeleteArgs> = z.object({
  select: TaskSelectSchema.optional(),
  include: TaskIncludeSchema.optional(),
  where: TaskWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.TaskDeleteArgs>;

export const TaskUpdateArgsSchema: z.ZodType<Prisma.TaskUpdateArgs> = z.object({
  select: TaskSelectSchema.optional(),
  include: TaskIncludeSchema.optional(),
  data: z.union([ TaskUpdateInputSchema,TaskUncheckedUpdateInputSchema ]),
  where: TaskWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.TaskUpdateArgs>;

export const TaskUpdateManyArgsSchema: z.ZodType<Prisma.TaskUpdateManyArgs> = z.object({
  data: z.union([ TaskUpdateManyMutationInputSchema,TaskUncheckedUpdateManyInputSchema ]),
  where: TaskWhereInputSchema.optional(),
}).strict() as z.ZodType<Prisma.TaskUpdateManyArgs>;

export const TaskDeleteManyArgsSchema: z.ZodType<Prisma.TaskDeleteManyArgs> = z.object({
  where: TaskWhereInputSchema.optional(),
}).strict() as z.ZodType<Prisma.TaskDeleteManyArgs>;

export const TestCreateArgsSchema: z.ZodType<Prisma.TestCreateArgs> = z.object({
  select: TestSelectSchema.optional(),
  include: TestIncludeSchema.optional(),
  data: z.union([ TestCreateInputSchema,TestUncheckedCreateInputSchema ]),
}).strict() as z.ZodType<Prisma.TestCreateArgs>;

export const TestUpsertArgsSchema: z.ZodType<Prisma.TestUpsertArgs> = z.object({
  select: TestSelectSchema.optional(),
  include: TestIncludeSchema.optional(),
  where: TestWhereUniqueInputSchema,
  create: z.union([ TestCreateInputSchema,TestUncheckedCreateInputSchema ]),
  update: z.union([ TestUpdateInputSchema,TestUncheckedUpdateInputSchema ]),
}).strict() as z.ZodType<Prisma.TestUpsertArgs>;

export const TestDeleteArgsSchema: z.ZodType<Prisma.TestDeleteArgs> = z.object({
  select: TestSelectSchema.optional(),
  include: TestIncludeSchema.optional(),
  where: TestWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.TestDeleteArgs>;

export const TestUpdateArgsSchema: z.ZodType<Prisma.TestUpdateArgs> = z.object({
  select: TestSelectSchema.optional(),
  include: TestIncludeSchema.optional(),
  data: z.union([ TestUpdateInputSchema,TestUncheckedUpdateInputSchema ]),
  where: TestWhereUniqueInputSchema,
}).strict() as z.ZodType<Prisma.TestUpdateArgs>;

export const TestUpdateManyArgsSchema: z.ZodType<Prisma.TestUpdateManyArgs> = z.object({
  data: z.union([ TestUpdateManyMutationInputSchema,TestUncheckedUpdateManyInputSchema ]),
  where: TestWhereInputSchema.optional(),
}).strict() as z.ZodType<Prisma.TestUpdateManyArgs>;

export const TestDeleteManyArgsSchema: z.ZodType<Prisma.TestDeleteManyArgs> = z.object({
  where: TestWhereInputSchema.optional(),
}).strict() as z.ZodType<Prisma.TestDeleteManyArgs>;