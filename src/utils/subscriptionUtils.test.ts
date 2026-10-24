import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INDIA_PRO_MONTHLY_PRICE_INR,
  COMPANY_TEAM_MONTHLY_PRICE_INR,
  getPlanLimits,
  canAccessVideoDuration,
  canAccessResolution,
  canAccessFrameRate,
  canAccessTeamMembers,
  canCreateWorkspace,
  canAccessEnterpriseVault,
  getCloudVaultQuota,
  generateIndiaProUpiUrl,
  generateCompanyTeamUpiUrl,
  canAccessProjectManagementDashboard,
  calculateProjectQueueMetrics,
} from './subscriptionUtils.ts';
import {
  UserSubscription,
  FREE_PLAN_LIMITS,
  INDIA_PRO_PLAN_LIMITS,
  COMPANY_TEAM_PLAN_LIMITS,
} from '../types/subscription.ts';

test('INDIA_PRO_MONTHLY_PRICE_INR is strictly ₹999 and COMPANY_TEAM_MONTHLY_PRICE_INR is ₹99,999', () => {
  assert.equal(INDIA_PRO_MONTHLY_PRICE_INR, 999);
  assert.equal(INDIA_PRO_PLAN_LIMITS.priceInr, 999);
  assert.equal(INDIA_PRO_PLAN_LIMITS.currency, 'INR');
  assert.equal(INDIA_PRO_PLAN_LIMITS.countryScope, 'India Only');

  assert.equal(COMPANY_TEAM_MONTHLY_PRICE_INR, 99999);
  assert.equal(COMPANY_TEAM_PLAN_LIMITS.priceInr, 99999);
  assert.equal(COMPANY_TEAM_PLAN_LIMITS.currency, 'INR');
  assert.equal(COMPANY_TEAM_PLAN_LIMITS.countryScope, 'India Only');
  assert.equal(COMPANY_TEAM_PLAN_LIMITS.teamWorkspaceSeats, 50);
});

test('Free plan restricts video duration to 15 seconds max', () => {
  const freeUser: UserSubscription = { plan: 'free', isActive: true, country: 'IN', priceInr: 0 };
  const limits = getPlanLimits(freeUser);
  assert.equal(limits.videoMaxDurationHours, 15 / 3600); // 15 seconds

  // 15 seconds should be allowed
  assert.equal(canAccessVideoDuration(15 / 3600, freeUser), true);

  // 1 minute (1/60 hr) or 100 hours should be blocked on free tier
  assert.equal(canAccessVideoDuration(1 / 60, freeUser), false);
  assert.equal(canAccessVideoDuration(100, freeUser), false);
});

test('India Creator Pro plan unlocks up to 100 hours max duration', () => {
  const proUser: UserSubscription = { plan: 'india_pro', isActive: true, country: 'IN', priceInr: 999 };
  const limits = getPlanLimits(proUser);
  assert.equal(limits.videoMaxDurationHours, 100);

  // All durations up to 100 hours are allowed
  assert.equal(canAccessVideoDuration(15 / 3600, proUser), true);
  assert.equal(canAccessVideoDuration(1, proUser), true);
  assert.equal(canAccessVideoDuration(24, proUser), true);
  assert.equal(canAccessVideoDuration(100, proUser), true);
  assert.equal(canAccessVideoDuration(101, proUser), false);
});

test('Team Company plan unlocks 100 hours, 4K, 120fps, and 50 team seats', () => {
  const companyUser: UserSubscription = {
    plan: 'company_team',
    isActive: true,
    country: 'IN',
    priceInr: 99999,
    companyName: 'Acme Studio India',
    gstin: '29ABCDE1234F1Z5',
  };
  const limits = getPlanLimits(companyUser);
  assert.equal(limits.priceInr, 99999);
  assert.equal(limits.teamWorkspaceSeats, 50);
  assert.equal(canAccessVideoDuration(100, companyUser), true);
  assert.equal(canAccessResolution('4K Ultra', companyUser), true);
  assert.equal(canAccessFrameRate(120, companyUser), true);
  assert.equal(canAccessTeamMembers(10, companyUser), true);
  assert.equal(canAccessTeamMembers(50, companyUser), true);
  assert.equal(canAccessTeamMembers(51, companyUser), false);
});

test('Free plan allows only 720p HD and up to 30fps, while Pro unlocks 4K and 120fps', () => {
  const freeUser: UserSubscription = { plan: 'free', isActive: true, country: 'IN', priceInr: 0 };
  const proUser: UserSubscription = { plan: 'india_pro', isActive: true, country: 'IN', priceInr: 999 };

  assert.equal(canAccessResolution('720p HD', freeUser), true);
  assert.equal(canAccessResolution('4K Ultra', freeUser), false);
  assert.equal(canAccessResolution('4K Ultra', proUser), true);

  assert.equal(canAccessFrameRate(30, freeUser), true);
  assert.equal(canAccessFrameRate(60, freeUser), false);
  assert.equal(canAccessFrameRate(120, proUser), true);
});

test('generateIndiaProUpiUrl and generateCompanyTeamUpiUrl generate valid UPI payment strings', () => {
  const url999 = generateIndiaProUpiUrl('memeforge.sub@icici', 'MemeForge Studio India');
  assert.ok(url999.startsWith('upi://pay?'));
  assert.ok(url999.includes('am=999'));
  assert.ok(url999.includes('cu=INR'));
  assert.ok(url999.includes('pa=memeforge.sub@icici'));

  const url99999 = generateCompanyTeamUpiUrl('memeforge.sub@icici', 'MemeForge Studio India');
  assert.ok(url99999.startsWith('upi://pay?'));
  assert.ok(url99999.includes('am=99999'));
  assert.ok(url99999.includes('cu=INR'));
  assert.ok(url99999.includes('pa=memeforge.sub@icici'));
});

test('Team Enterprise subscription (Rs. 99,999) unlocks 10 isolated workspaces and 50 TB Cloud Vault', () => {
  const companyUser: UserSubscription = {
    plan: 'company_team',
    isActive: true,
    country: 'IN',
    priceInr: 99999,
    companyName: 'Acme Studio India',
    gstin: '29ABCDE1234F1Z5',
  };
  const freeUser: UserSubscription = { plan: 'free', isActive: true, country: 'IN', priceInr: 0 };
  const proUser: UserSubscription = { plan: 'india_pro', isActive: true, country: 'IN', priceInr: 999 };

  // Workspaces limit check
  assert.equal(canCreateWorkspace(0, companyUser), true);
  assert.equal(canCreateWorkspace(9, companyUser), true);
  assert.equal(canCreateWorkspace(10, companyUser), false);

  assert.equal(canCreateWorkspace(0, freeUser), true);
  assert.equal(canCreateWorkspace(1, freeUser), false);
  assert.equal(canCreateWorkspace(1, proUser), false);

  // Cloud Vault checks
  assert.equal(canAccessEnterpriseVault(companyUser), true);
  assert.equal(canAccessEnterpriseVault(freeUser), false);
  assert.equal(canAccessEnterpriseVault(proUser), false);

  const quota = getCloudVaultQuota(companyUser);
  assert.equal(quota.storageTb, 50);
  assert.equal(quota.maxWorkspaces, 10);
  assert.equal(quota.isEnterprise, true);
  assert.ok(quota.encryptionStandard.includes('AES-256'));
});

test('Team Enterprise subscription unlocks Project Management dashboard and queue metrics', () => {
  const companyUser: UserSubscription = {
    plan: 'company_team',
    isActive: true,
    country: 'IN',
    priceInr: 99999,
  };
  const freeUser: UserSubscription = { plan: 'free', isActive: true, country: 'IN', priceInr: 0 };
  const proUser: UserSubscription = { plan: 'india_pro', isActive: true, country: 'IN', priceInr: 999 };

  assert.equal(canAccessProjectManagementDashboard(companyUser), true);
  assert.equal(canAccessProjectManagementDashboard(freeUser), false);
  assert.equal(canAccessProjectManagementDashboard(proUser), false);

  const sampleJobs = [
    { status: 'rendering', progress: 80 },
    { status: 'compositing', progress: 40 },
    { status: 'queued', progress: 0 },
    { status: 'completed', progress: 100 },
  ];
  const metrics = calculateProjectQueueMetrics(sampleJobs);
  assert.equal(metrics.total, 4);
  assert.equal(metrics.activeCount, 2);
  assert.equal(metrics.queuedCount, 1);
  assert.equal(metrics.completedCount, 1);
  assert.equal(metrics.avgProgress, 60);
});

