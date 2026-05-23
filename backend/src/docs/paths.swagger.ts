/**
 * @openapi
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Health check
 *     description: Verifies that the API is running.
 *     security: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login
 *     description: Returns JWT and public user profile. Same error message for invalid email or password.
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Current user
 *     description: Returns the authenticated user (no passwordHash).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/AuthUser'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *
 * /polls:
 *   get:
 *     tags: [Polls]
 *     summary: List polls
 *     description: USER sees active polls only. ADMIN sees all. Includes vote counts and hasVoted for USER.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filter active polls (optional)
 *     responses:
 *       200:
 *         description: Poll list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PollListEnvelope'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *   post:
 *     tags: [Polls]
 *     summary: Create poll
 *     description: ADMIN only. Minimum 2 options.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePollRequest'
 *     responses:
 *       201:
 *         description: Poll created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PollEnvelope'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *
 * /polls/{id}:
 *   get:
 *     tags: [Polls]
 *     summary: Get poll by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PollId'
 *     responses:
 *       200:
 *         description: Poll detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PollEnvelope'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *   put:
 *     tags: [Polls]
 *     summary: Update poll
 *     description: ADMIN only.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PollId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePollRequest'
 *     responses:
 *       200:
 *         description: Poll updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PollEnvelope'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *   delete:
 *     tags: [Polls]
 *     summary: Delete poll
 *     description: ADMIN only.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PollId'
 *     responses:
 *       200:
 *         description: Poll deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiSuccessEnvelope'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *
 * /polls/{id}/results:
 *   get:
 *     tags: [Polls]
 *     summary: Poll results (aggregated)
 *     description: Vote counts and percentages per option. USER may need to have voted or poll must be active.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PollId'
 *     responses:
 *       200:
 *         description: Aggregated results
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PollResultsEnvelope'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *
 * /polls/{id}/vote:
 *   post:
 *     tags: [Votes]
 *     summary: Cast a vote
 *     description: USER only. One vote per user per poll. Returns vote and updated results.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PollId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VoteRequest'
 *     responses:
 *       201:
 *         description: Vote registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VoteResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       409:
 *         $ref: '#/components/responses/Conflict'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *
 * /dashboard/summary:
 *   get:
 *     tags: [Dashboard]
 *     summary: Dashboard summary
 *     description: ADMIN receives global metrics. USER receives participation-focused metrics.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardSummaryEnvelope'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *
 * /dashboard/polls/{id}/results:
 *   get:
 *     tags: [Dashboard]
 *     summary: Dashboard poll results
 *     description: Aggregated results for charts and polling (includes generatedAt).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PollId'
 *     responses:
 *       200:
 *         description: Poll results for dashboard
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/PollResults'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 *
 * components:
 *   parameters:
 *     PollId:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: Poll ID (cuid)
 */

export {}
