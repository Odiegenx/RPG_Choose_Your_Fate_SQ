# TODO: Add Findings to Risk Analysis

Items discovered during integration testing of the availability module that should be added to the risk analysis spreadsheet. Each entry suggests probability/impact and proposed mitigation — adjust ratings as the team sees fit.

---

## 1. Auth-layer routes through availability DataSource

**Risk:** JwtFilter loads user details via AccountRepository, which is wired to `routingDataSource`. After failover, JPA user lookups hit secondary. If admin user data is missing from secondary, all admin operations (including the failback needed to recover) return 403 with empty body.

- **Probability:** Medium (will happen on every failover unless secondary is seeded)
- **Impact:** High (locks admins out of recovery operations)
- **Mitigation:** Operational requirement — secondary must be seeded with same user/admin records as primary before failover is attempted.
- **Long-term fix:** Dedicated auth-only DataSource that always hits primary, OR stateless JWT validation without DB lookup.
- **Source:** Endpoint test design doc Section 6.1

---

## 2. ManualDataSynchronizationService is a logged warning, not a real sync

**Risk:** `synchronizeSecondaryToPrimary()` only logs a WARN message — no actual data sync is performed. Failback completes successfully without syncing writes that occurred on secondary during the failover window. Result: silent data loss on the next primary write.

- **Probability:** High (every failback in current state)
- **Impact:** High (silent data loss)
- **Current state:** Documented in logs at WARN level
- **Mitigation:** Production deployment requires a DBA to manually run reviewed SQL sync scripts between `POST /availability/failback/begin` and `POST /availability/failback/complete`.
- **Long-term fix:** CDC-based reverse replication, outbox-style apply-on-resume, or Spring profile-based bean injection (production retains strict fail-fast).
- **Source:** Endpoint test design doc Section 6.3 + White-box test design doc Section 11

---

## 3. Connection pooling uses DriverManagerDataSource (no pool)

**Risk:** Both primary and secondary DataSources are configured with `DriverManagerDataSource`, which opens a new physical connection per query. Acceptable for course-scope, but will not survive production load.

- **Probability:** Low (only matters under production load)
- **Impact:** Medium (degraded performance, connection exhaustion under load)
- **Mitigation:** Acceptable for exam scope.
- **Long-term fix:** Replace each underlying DataSource with HikariCP (one pool per role). The `AbstractRoutingDataSource` wrapper is pool-agnostic, so the routing mechanism is unaffected.
- **Source:** Original review (Step 7 from availability work)

---

## 4. Endpoint tests skipped on non-chromium browsers

**Risk:** Playwright availability endpoint tests run only on chromium because backend state is global and in-memory. Cross-browser parallel execution causes race conditions where one browser's cleanup interferes with another's test setup.

- **Probability:** N/A (deliberate test-strategy decision)
- **Impact:** Low (browser compatibility is not relevant for backend REST tests)
- **Status:** Documented in spec file and endpoint test design doc Section 6.2
- **Source:** Endpoint test design doc Section 6.2
