import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import DOMPurify from "dompurify";
import { AdminApiFp, APIResponsePosts, PostApiFp } from "../../api/generated";
import {
  Alert,
  Autocomplete,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Pagination,
  Skeleton,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

// --- Utils
const sanitize = (html: string) => ({ __html: DOMPurify.sanitize(html) });

function useAdminCheck() {
  const api = AdminApiFp();
  const [isAdmin, setAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const verify = useCallback(async () => {
    try {
      const request = await api.verifyTokenAdminVerifyGet();
      await request();
      setAdmin(true);
    } catch (e: any) {
      setAdmin(false);
    }
  }, [api]);
  useEffect(() => {
    verify();
  }, [verify]);
  return { isAdmin, error };
}

// --- Types (adjust to your generator if needed)
type PostItem = {
  id: number;
  version: string;
  text: string; // HTML
  created_at?: string;
};

// ==========================
// Release List Page
// ==========================
export default function ReleasePage() {
  const apiPost = PostApiFp();
  const { isAdmin } = useAdminCheck();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<APIResponsePosts | null>(null);

  // filters
  const [query, setQuery] = useState("");
  const [selectedVersion, setSelectedVersion] = useState<PostItem | null>(null);
  const [sort, setSort] = useState<"new" | "old">("new");

  // pagination (client-side for now)
  const [page, setPage] = useState(1);
  const perPage = 10;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const request = await apiPost.getAllPostGet(undefined, 1000);
      const response = await request();
      setData(response.data);
    } catch (e: any) {
      setError("Не удалось загрузить релизы");
    } finally {
      setLoading(false);
    }
  }, [apiPost]);

  useEffect(() => {
    fetchData();
  }, []);

  // derive list
  const items = useMemo(() => {
    const src: PostItem[] = data?.items ?? [];
    let out = src;

    // filter by query (search in version and text as plain text)
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      out = out.filter((i) => {
        const plain = DOMPurify.sanitize(i.text, { ALLOWED_TAGS: [] })
          .replace(/\s+/g, " ")
          .toLowerCase();
        return i.version.toLowerCase().includes(q) || plain.includes(q);
      });
    }

    // filter by selected version
    if (selectedVersion) {
      out = out.filter((i) => i.id === selectedVersion.id);
    }

    // sort by created_at desc/asc with fallback to id
    out = [...out].sort((a, b) => {
      const aKey = a.created_at ? Date.parse(a.created_at) : a.id;
      const bKey = b.created_at ? Date.parse(b.created_at) : b.id;
      return sort === "new" ? bKey - aKey : aKey - bKey;
    });

    return out;
  }, [data, query, selectedVersion, sort]);

  const totalPages = Math.max(1, Math.ceil((items?.length || 0) / perPage));
  const pageItems = items.slice((page - 1) * perPage, page * perPage);

  // delete flow
  const [pendingDelete, setPendingDelete] = useState<PostItem | null>(null);
  const [snack, setSnack] = useState<string | null>(null);

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        const request = await apiPost.postDeletePostIdDelete(id);
        await request();
        setSnack("Релиз удалён");
        // refresh
        fetchData();
      } catch (e) {
        setSnack("Ошибка удаления");
      }
    },
    [apiPost, fetchData]
  );

  // unique versions for Autocomplete
  const releaseOptions = useMemo(() => {
    const src: PostItem[] = data?.items ?? [];
    const uniq = new Map<number, PostItem>();
    src.forEach((i) => uniq.set(i.id, i));
    return Array.from(uniq.values());
  }, [data]);

  return (
    <Box sx={{ maxWidth: 960, mx: "auto", px: 2, py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Релизы
      </Typography>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ sm: "center" }}
      >
        <TextField
          label="Поиск"
          placeholder="Версия или текст"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          fullWidth
        />

        <Autocomplete
          sx={{ minWidth: 260 }}
          filterOptions={(x) => x}
          getOptionLabel={(option) => option.version}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => <TextField {...params} label="Версия" />}
          options={releaseOptions}
          value={selectedVersion}
          onChange={(_, v) => {
            setSelectedVersion(v);
            setPage(1);
          }}
          loading={loading}
        />

        <TextField
          select
          label="Сортировка"
          value={sort}
          onChange={(e) => setSort(e.target.value as any)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="new">Сначала новые</MenuItem>
          <MenuItem value="old">Сначала старые</MenuItem>
        </TextField>
      </Stack>

      <Divider sx={{ my: 3 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Stack spacing={2}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader
                title={<Skeleton width={180} />}
                subheader={<Skeleton width={120} />}
              />
              <CardContent>
                <Skeleton height={18} />
                <Skeleton height={18} />
                <Skeleton height={18} width="80%" />
              </CardContent>
            </Card>
          ))}
        </Stack>
      ) : pageItems.length ? (
        <Stack spacing={2}>
          {pageItems.map((item) => (
            <Card key={item.id} variant="outlined">
              <CardHeader
                title={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip label={`${item.version}`} size="small" />
                    <Typography variant="h6">Релиз {item.version}</Typography>
                  </Stack>
                }
                subheader={
                  item.created_at
                    ? new Date(item.created_at).toLocaleString()
                    : undefined
                }
                action={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Button
                      component={Link}
                      to={`/release/${item.id}`}
                      endIcon={<OpenInNewIcon fontSize="small" />}
                    >
                      Открыть
                    </Button>
                    {isAdmin && (
                      <IconButton
                        color="error"
                        onClick={() => setPendingDelete(item)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Stack>
                }
              />
              <CardContent>
                <Box
                  sx={{
                    position: "relative",
                    maxHeight: 132,
                    overflow: "hidden",
                  }}
                >
                  <div dangerouslySetInnerHTML={sanitize(item.text)} />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 40,
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 80%)",
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          ))}

          <Stack alignItems="center" sx={{ mt: 1 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, p) => setPage(p)}
            />
          </Stack>
        </Stack>
      ) : (
        <Typography variant="body1">Релизов нет</Typography>
      )}

      {/* Delete confirm */}
      <Dialog open={!!pendingDelete} onClose={() => setPendingDelete(null)}>
        <DialogTitle>Удалить релиз?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Это действие нельзя отменить. Релиз {pendingDelete?.version} будет
            удалён.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingDelete(null)}>Отмена</Button>
          <Button
            color="error"
            onClick={() => {
              if (pendingDelete) handleDelete(pendingDelete.id);
              setPendingDelete(null);
            }}
          >
            Удалить
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!snack}
        autoHideDuration={3000}
        onClose={() => setSnack(null)}
        message={snack ?? ""}
      />
    </Box>
  );
}

// ==========================
// Release Details Page
// ==========================
export function ReleaseDetailsPage() {
  const apiPost = PostApiFp();
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: { item?: PostItem } };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [item, setItem] = useState<PostItem | null>(state?.item ?? null);

  const fetchById = useCallback(
    async (postId: number) => {
      try {
        const request = await apiPost.getByIdPostPostIdGet(postId);
        const resp = await request();
        return resp.data; // возвращаем только данные
      } catch (e) {
        return null;
      }
    },
    [apiPost]
  );

  useEffect(() => {
    let ignore = false;

    const run = async () => {
      try {
        if (item) return;

        if (!id) throw new Error("Нет id релиза");

        setLoading(true);
        const data = await fetchById(Number(id));
        if (!ignore && data) setItem(data as PostItem);
      } catch (e: any) {
        if (!ignore) setError(e?.message || "Ошибка загрузки релиза");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    run();

    return () => {
      ignore = true;
    };
  }, [id, item]);

  return (
    <Box sx={{ maxWidth: 960, mx: "auto", px: 2, py: 3 }}>
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link to="/releases">Релизы</Link>
        <Typography color="text.primary">Релиз #{id}</Typography>
      </Breadcrumbs>

      {loading && (
        <>
          <Skeleton width={240} height={38} />
          <Skeleton height={22} />
          <Skeleton height={22} width="80%" />
          <Skeleton height={300} sx={{ mt: 2 }} />
        </>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {item && !loading && !error && (
        <>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <Chip label={`${item.version}`} />
            {item.created_at && (
              <Typography variant="body2" color="text.secondary">
                {new Date(item.created_at).toLocaleString()}
              </Typography>
            )}
          </Stack>

          <Typography variant="h4" gutterBottom>
            Релиз {item.version}
          </Typography>

          <Divider sx={{ mb: 2 }} />

          {/* Full HTML content */}
          <Box sx={{ "& img": { maxWidth: "100%" } }}>
            <div dangerouslySetInnerHTML={sanitize(item.text)} />
          </Box>

          <Divider sx={{ mt: 3, mb: 1 }} />
          <Stack direction="row" spacing={1}>
            <Button onClick={() => navigate(-1)}>Назад</Button>
            <Button component={Link} to="/release">
              К списку
            </Button>
          </Stack>
        </>
      )}
    </Box>
  );
}
