import { afterAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { createApp } from '../app'
import { prisma } from '../config/prisma'
import {
  ADMIN_CREDENTIALS,
  USER_CREDENTIALS,
  authHeader,
  loginAndGetToken,
} from './helpers'

const app = createApp()

const TEST_POLL_PREFIX = '[TEST] '
const TEST_REGISTER_EMAIL = 'integration-register@pulsevote.test'
const TEST_REGISTER_PASSWORD = 'RegisterTest123!'

let adminToken = ''
let userToken = ''
let testPollId = ''
let testOptionId = ''

describe('PulseVote API — integration', () => {
  afterAll(async () => {
    if (testPollId) {
      await prisma.poll.delete({ where: { id: testPollId } }).catch(() => undefined)
    }
    await prisma.user
      .deleteMany({ where: { email: TEST_REGISTER_EMAIL } })
      .catch(() => undefined)
    await prisma.$disconnect()
  })

  it('GET /api/health — returns 200 and status ok', async () => {
    const res = await request(app).get('/api/health').expect(200)

    expect(res.body).toMatchObject({
      status: 'ok',
      service: 'pulsevote-api',
    })
  })

  it('POST /api/auth/register — creates USER and returns token', async () => {
    await prisma.user.deleteMany({ where: { email: TEST_REGISTER_EMAIL } }).catch(() => undefined)

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Usuario Integración',
        email: TEST_REGISTER_EMAIL,
        password: TEST_REGISTER_PASSWORD,
      })
      .expect(201)

    expect(res.body.success).toBe(true)
    expect(res.body.data.user.role).toBe('USER')
    expect(res.body.data.user.email).toBe(TEST_REGISTER_EMAIL)
    expect(res.body.data.token).toBeTruthy()
  })

  it('POST /api/auth/register — duplicate email returns 409', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Otro nombre',
        email: TEST_REGISTER_EMAIL,
        password: TEST_REGISTER_PASSWORD,
      })
      .expect(409)

    expect(res.body.success).toBe(false)
    expect(res.body.error?.code).toBe('EMAIL_ALREADY_EXISTS')
  })

  it('POST /api/auth/login — registered user can sign in', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: TEST_REGISTER_EMAIL, password: TEST_REGISTER_PASSWORD })
      .expect(200)

    expect(res.body.data.user.email).toBe(TEST_REGISTER_EMAIL)
    expect(res.body.data.token).toBeTruthy()
  })

  it('POST /api/auth/login — admin returns token and role ADMIN', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send(ADMIN_CREDENTIALS)
      .expect(200)

    expect(res.body.success).toBe(true)
    expect(res.body.message).toBeTruthy()
    expect(res.body.data.user.role).toBe('ADMIN')
    expect(res.body.data.token).toBeTruthy()

    adminToken = res.body.data.token
  })

  it('POST /api/auth/login — user returns token and role USER', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send(USER_CREDENTIALS)
      .expect(200)

    expect(res.body.success).toBe(true)
    expect(res.body.data.user.role).toBe('USER')
    expect(res.body.data.token).toBeTruthy()

    userToken = res.body.data.token
  })

  it('GET /api/polls — without token returns 401', async () => {
    const res = await request(app).get('/api/polls').expect(401)

    expect(res.body.success).toBe(false)
    expect(res.body.message).toBeTruthy()
    expect(res.body.error?.code).toBe('UNAUTHORIZED')
  })

  it('POST /api/polls — admin creates poll with envelope', async () => {
    const res = await request(app)
      .post('/api/polls')
      .set(authHeader(adminToken))
      .send({
        question: `${TEST_POLL_PREFIX} Automated poll question?`,
        description: 'Created from automated test',
        isActive: true,
        options: [{ text: 'Option A' }, { text: 'Option B' }],
      })
      .expect(201)

    expect(res.body.success).toBe(true)
    expect(res.body.message).toBeTruthy()
    expect(res.body.data.id).toBeTruthy()
    expect(res.body.data.options).toHaveLength(2)

    testPollId = res.body.data.id
    testOptionId = res.body.data.options[0].id
  })

  it('POST /api/polls — user cannot create poll (403)', async () => {
    const res = await request(app)
      .post('/api/polls')
      .set(authHeader(userToken))
      .send({
        question: `${TEST_POLL_PREFIX} Should fail`,
        options: [{ text: 'A' }, { text: 'B' }],
      })
      .expect(403)

    expect(res.body.success).toBe(false)
    expect(res.body.error?.code).toBe('FORBIDDEN')
  })

  it('POST /api/polls/:id/vote — user votes once successfully', async () => {
    expect(testPollId).toBeTruthy()
    expect(testOptionId).toBeTruthy()

    const res = await request(app)
      .post(`/api/polls/${testPollId}/vote`)
      .set(authHeader(userToken))
      .send({ optionId: testOptionId })
      .expect(201)

    expect(res.body.success).toBe(true)
    expect(res.body.data?.vote?.pollId).toBe(testPollId)
    expect(res.body.data?.results).toBeTruthy()
  })

  it('POST /api/polls/:id/vote — duplicate vote returns 409', async () => {
    const res = await request(app)
      .post(`/api/polls/${testPollId}/vote`)
      .set(authHeader(userToken))
      .send({ optionId: testOptionId })
      .expect(409)

    expect(res.body.success).toBe(false)
    expect(res.body.error?.code).toBe('ALREADY_VOTED')
    expect(res.body.message).toMatch(/votado/i)
  })

  it('POST /api/polls/:id/vote — admin cannot vote (403)', async () => {
    const res = await request(app)
      .post(`/api/polls/${testPollId}/vote`)
      .set(authHeader(adminToken))
      .send({ optionId: testOptionId })
      .expect(403)

    expect(res.body.success).toBe(false)
    expect(res.body.error?.code).toBe('FORBIDDEN')
  })
})
