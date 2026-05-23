/**
 * @openapi
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: admin@pulsevote.app
 *         password:
 *           type: string
 *           format: password
 *           example: Admin123!
 *
 *     AuthUser:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         role:
 *           type: string
 *           enum: [ADMIN, USER]
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               description: JWT Bearer token
 *             user:
 *               $ref: '#/components/schemas/AuthUser'
 *
 *     PollOption:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         text:
 *           type: string
 *         pollId:
 *           type: string
 *         voteCount:
 *           type: integer
 *
 *     Poll:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         question:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         isActive:
 *           type: boolean
 *         createdById:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         totalVotes:
 *           type: integer
 *         hasVoted:
 *           type: boolean
 *         options:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PollOption'
 *
 *     PollOptionInput:
 *       type: object
 *       required: [text]
 *       properties:
 *         id:
 *           type: string
 *           description: Optional on update to keep existing option
 *         text:
 *           type: string
 *           example: React
 *
 *     CreatePollRequest:
 *       type: object
 *       required: [question, options]
 *       properties:
 *         question:
 *           type: string
 *           example: Which frontend framework do you prefer?
 *         description:
 *           type: string
 *           nullable: true
 *           example: Help us understand team preferences.
 *         isActive:
 *           type: boolean
 *           default: true
 *         options:
 *           type: array
 *           minItems: 2
 *           items:
 *             $ref: '#/components/schemas/PollOptionInput'
 *           example:
 *             - text: React
 *             - text: Vue
 *             - text: Angular
 *             - text: Svelte
 *
 *     UpdatePollRequest:
 *       $ref: '#/components/schemas/CreatePollRequest'
 *
 *     VoteRequest:
 *       type: object
 *       required: [optionId]
 *       properties:
 *         optionId:
 *           type: string
 *           example: clxxxxxxxxxxxxxxxx
 *
 *     PollResultOption:
 *       type: object
 *       properties:
 *         optionId:
 *           type: string
 *         text:
 *           type: string
 *         votes:
 *           type: integer
 *         percentage:
 *           type: number
 *           format: float
 *           description: Rounded to 1 decimal; 0 if no votes
 *
 *     PollResults:
 *       type: object
 *       properties:
 *         pollId:
 *           type: string
 *         question:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         isActive:
 *           type: boolean
 *         totalVotes:
 *           type: integer
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         generatedAt:
 *           type: string
 *           format: date-time
 *         options:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PollResultOption'
 *
 *     VoteRecord:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         pollId:
 *           type: string
 *         optionId:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     VoteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             vote:
 *               $ref: '#/components/schemas/VoteRecord'
 *             results:
 *               $ref: '#/components/schemas/PollResults'
 *
 *     AdminDashboardSummary:
 *       type: object
 *       properties:
 *         totalPolls:
 *           type: integer
 *         activePolls:
 *           type: integer
 *         inactivePolls:
 *           type: integer
 *         totalVotes:
 *           type: integer
 *         totalUsers:
 *           type: integer
 *         averageParticipation:
 *           type: number
 *         latestPolls:
 *           type: array
 *           items:
 *             type: object
 *         mostVotedPolls:
 *           type: array
 *           items:
 *             type: object
 *         polls:
 *           type: array
 *           items:
 *             type: object
 *
 *     UserDashboardSummary:
 *       type: object
 *       properties:
 *         activePolls:
 *           type: integer
 *         pollsVotedByUser:
 *           type: integer
 *         pendingPolls:
 *           type: integer
 *         totalVotes:
 *           type: integer
 *         latestActivePolls:
 *           type: array
 *           items:
 *             type: object
 *
 *     DashboardSummaryEnvelope:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           oneOf:
 *             - $ref: '#/components/schemas/AdminDashboardSummary'
 *             - $ref: '#/components/schemas/UserDashboardSummary'
 *
 *     HealthResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: ok
 *         service:
 *           type: string
 *           example: pulsevote-api
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: object
 *           properties:
 *             code:
 *               type: string
 *             message:
 *               type: string
 *
 *   responses:
 *     BadRequest:
 *       description: Bad Request
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     Unauthorized:
 *       description: Unauthorized
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     Forbidden:
 *       description: Forbidden
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     NotFound:
 *       description: Not Found
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     Conflict:
 *       description: Conflict
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     InternalError:
 *       description: Internal Server Error
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: JWT from POST /auth/login. Use Authorize and paste the token.
 */

export {}
