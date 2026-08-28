# Production / demo environment

The public demo environment will be wired to the reusable Terraform modules after local builds and CI gates are proven.

Required provider credentials are supplied outside Git:

```text
RENDER_API_KEY
RENDER_OWNER_ID
```

No secret or Terraform state is committed to the repository.
