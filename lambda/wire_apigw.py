import boto3, json

API     = "lx2i5gpnc9"
ROOT    = "1j3xfekbic"
REGION  = "us-east-1"
ACCOUNT = "402852608363"

apigw  = boto3.client("apigateway", region_name=REGION)
lmbda  = boto3.client("lambda",     region_name=REGION)

def lambda_uri(fn):
    return (
        f"arn:aws:apigateway:{REGION}:lambda:path/2015-03-31/functions/"
        f"arn:aws:lambda:{REGION}:{ACCOUNT}:function:{fn}/invocations"
    )

def create_resource(parent_id, path_part):
    r = apigw.create_resource(restApiId=API, parentId=parent_id, pathPart=path_part)
    return r["id"]

def add_method(resource_id, method):
    apigw.put_method(
        restApiId=API, resourceId=resource_id,
        httpMethod=method, authorizationType="NONE", apiKeyRequired=False
    )

def add_integration(resource_id, method, fn):
    apigw.put_integration(
        restApiId=API, resourceId=resource_id,
        httpMethod=method, type="AWS_PROXY",
        integrationHttpMethod="POST",
        uri=lambda_uri(fn),
        passthroughBehavior="WHEN_NO_MATCH",
        contentHandling="CONVERT_TO_TEXT",
        timeoutInMillis=29000
    )

def grant_permission(fn, sid, path_suffix):
    source_arn = f"arn:aws:execute-api:{REGION}:{ACCOUNT}:{API}/*/*{path_suffix}"
    try:
        lmbda.add_permission(
            FunctionName=fn, StatementId=sid,
            Action="lambda:InvokeFunction",
            Principal="apigateway.amazonaws.com",
            SourceArn=source_arn
        )
    except lmbda.exceptions.ResourceConflictException:
        print(f"    permission {sid} already exists, skipping")

def wire(parent_id, path_part, fn, methods, path_suffix):
    print(f"\n  Creating /{path_part} ...")
    rid = create_resource(parent_id, path_part)
    print(f"  resource id: {rid}")
    for m in methods:
        add_method(rid, m)
        add_integration(rid, m, fn)
        print(f"  {m} ✓")
    grant_permission(fn, f"apigw-{path_part}", path_suffix)
    print(f"  Lambda permission granted ✓")
    return rid

# ── 1. /assignments ──────────────────────────────────────────────────
print("=" * 40)
print("1) /assignments")
aid = wire(ROOT, "assignments", "mindcampus-assignments",
           ["GET","POST","OPTIONS"], "/assignments")
aid_sub = create_resource(aid, "{assignmentId}")
print(f"  /{'{assignmentId}'} id: {aid_sub}")
for m in ["DELETE","OPTIONS"]:
    add_method(aid_sub, m)
    add_integration(aid_sub, m, "mindcampus-assignments")
    print(f"  /{'{assignmentId}'} {m} ✓")
grant_permission("mindcampus-assignments", "apigw-assignments-id", "/assignments/*")
print("  sub-resource Lambda permission granted ✓")

# ── 2. /exams ─────────────────────────────────────────────────────────
print("=" * 40)
print("2) /exams")
eid = wire(ROOT, "exams", "mindcampus-exams",
           ["GET","POST","OPTIONS"], "/exams")
eid_sub = create_resource(eid, "{examId}")
print(f"  /{'{examId}'} id: {eid_sub}")
for m in ["DELETE","OPTIONS"]:
    add_method(eid_sub, m)
    add_integration(eid_sub, m, "mindcampus-exams")
    print(f"  /{'{examId}'} {m} ✓")
grant_permission("mindcampus-exams", "apigw-exams-id", "/exams/*")
print("  sub-resource Lambda permission granted ✓")

# ── 3. /attendance ────────────────────────────────────────────────────
print("=" * 40)
print("3) /attendance")
wire(ROOT, "attendance", "mindcampus-attendance",
     ["GET","POST","OPTIONS"], "/attendance")

# ── 4. /notifications ─────────────────────────────────────────────────
print("=" * 40)
print("4) /notifications")
nid = wire(ROOT, "notifications", "mindcampus-notifications",
           ["GET","OPTIONS"], "/notifications")
nread = create_resource(nid, "read")
print(f"  /read id: {nread}")
for m in ["PUT","OPTIONS"]:
    add_method(nread, m)
    add_integration(nread, m, "mindcampus-notifications")
    print(f"  /read {m} ✓")
grant_permission("mindcampus-notifications", "apigw-notifications-read", "/notifications/read")
print("  /read Lambda permission granted ✓")

# ── 5. /announcements ─────────────────────────────────────────────────
print("=" * 40)
print("5) /announcements")
anid = wire(ROOT, "announcements", "mindcampus-announcements",
            ["GET","POST","OPTIONS"], "/announcements")
anid_sub = create_resource(anid, "{announcementId}")
print(f"  /{'{announcementId}'} id: {anid_sub}")
for m in ["DELETE","OPTIONS"]:
    add_method(anid_sub, m)
    add_integration(anid_sub, m, "mindcampus-announcements")
    print(f"  /{'{announcementId}'} {m} ✓")
grant_permission("mindcampus-announcements", "apigw-announcements-id", "/announcements/*")
print("  sub-resource Lambda permission granted ✓")

# ── 6. /students ──────────────────────────────────────────────────────
print("=" * 40)
print("6) /students")
sid = wire(ROOT, "students", "mindcampus-students",
           ["GET","OPTIONS"], "/students")
sid_sub = create_resource(sid, "{studentId}")
print(f"  /{'{studentId}'} id: {sid_sub}")
for m in ["PUT","OPTIONS"]:
    add_method(sid_sub, m)
    add_integration(sid_sub, m, "mindcampus-students")
    print(f"  /{'{studentId}'} {m} ✓")
grant_permission("mindcampus-students", "apigw-students-id", "/students/*")
print("  sub-resource Lambda permission granted ✓")

# ── Deploy ────────────────────────────────────────────────────────────
print("=" * 40)
print("Deploying to prod...")
dep = apigw.create_deployment(
    restApiId=API,
    stageName="prod",
    description="Wire assignments, exams, attendance, notifications, announcements, students"
)
print(f"Deployment ID: {dep['id']}")
print("✓ Live at https://lx2i5gpnc9.execute-api.us-east-1.amazonaws.com/prod")

# ── Final route list ──────────────────────────────────────────────────
print("\n" + "=" * 40)
print("FINAL ROUTE LIST")
print("=" * 40)
resources = apigw.get_resources(restApiId=API, limit=100)["items"]
for r in sorted(resources, key=lambda x: x["path"]):
    methods = list(r.get("resourceMethods", {}).keys())
    if methods:
        print(f"  {r['path']:45} {', '.join(sorted(methods))}")
    else:
        print(f"  {r['path']}")
