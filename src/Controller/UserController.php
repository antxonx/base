<?php

/**
 * User controller
 */

namespace App\Controller;

use Antxony\Def\Editable\Editable;
use App\Entity\User;
use Antxony\Util;
use Exception;
use Doctrine\ORM\ORMException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use App\Repository\UserRepository;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

/**
 * Usuarios
 * @package App\Controller
 * @Route("/user")
 * @author Antxony <dantonyofcarim@gmail.com>
 */
class UserController extends AbstractController
{

    protected UserRepository $rep;

    protected User $actualUser;

    protected UserPasswordEncoderInterface $passwordEncoder;

    protected Util $util;

    public function __construct(UserRepository $rep, Security $security, UserPasswordEncoderInterface $passwordEncoder, Util $util)
    {
        $this->actualUser = $security->getUser();
        $this->util = $util;
        $this->rep = $rep;
        $this->passwordEncoder = $passwordEncoder;
    }

    /**
     * index
     * 
     * @Route("", name="user_index", methods={"GET"})
     * @IsGranted("ROLE_ADMIN")
     */
    public function index(): Response
    {
        return $this->render('view/user/index.html.twig', [
            'controller_name' => 'UserController',
        ]);
    }

    /**
     * get all users
     * 
     * @Route("/list", name="user_list", methods={"GET"}, options={"expose" = true})
     * @IsGranted("ROLE_ADMIN")
     */
    public function indexA(Request $request): Response
    {
        try {
            $params = json_decode(json_encode($request->query->all()));
            $result = $this->rep->getBy($params);
            $showed = ((isset($params->page)) ? $params->page * $this->util::PAGE_COUNT : $this->util::PAGE_COUNT);
            $users = $result['paginator'];
            $maxPages = ceil($users->count() / $this->util::PAGE_COUNT);
            return $this->render("view/user/tbody.html.twig", [
                'users' => $users,
                'maxPages' => $maxPages,
                'thisPage' => ((isset($params->page)) ? $params->page : 1),
                'showed' => (($showed > $users->count()) ? $users->count() : $showed),
            ]);
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * add form
     * 
     * @Route("/form", name="user_form", methods={"GET"}, options={"expose" = true})
     * @IsGranted("ROLE_ADMIN")
     */
    public function form(): Response
    {
        try {
            return $this->render("view/user/form.html.twig");
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * password form
     * 
     * @Route("/key", name="user_key", methods={"GET"}, options={"expose" = true})
     * @IsGranted("ROLE_ADMIN")
     */
    public function key(): Response
    {
        try {
            return $this->render("view/user/key.html.twig");
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * change password
     * 
     * @Route("/key/{id}", name="user_key_update", methods={"PATCH"}, options={"expose" = true})
     * @IsGranted("ROLE_ADMIN")
     */
    public function keyUpdate(int $id, Request $request): Response
    {
        try {
            $content = json_decode($request->getContent());
            $user = $this->rep->find($id);
            $user->setPassword($this->passwordEncoder->encodePassword($user, $content->password));
            $this->rep->update();
            $this->util->info("Se ha actalizado la contraseña del usuario <b>{$user->getId()}</b>(<em>{$user->getUsername()}</em>)");
            return new Response("Se ha actualizado la contraseña");
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * reactive user
     * 
     * @Route("/reactivate/{id}", name="user_reactivate", methods={"PATCH"}, options={"expose" = true})
     * @IsGranted("ROLE_ADMIN")
     */
    public function reactivate(int $id): Response
    {
        try {
            $user = $this->rep->find($id);
            $user->setSuspended(false);
            $this->rep->update();
            $this->util->info("Se ha reactivado al usuario <b>{$id}</b>(<em>{$user->getUsername()}</em>)");
            return new Response("Usuario reactivado");
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * change password form
     * 
     * @Route("/profile/pass", name="user_profile_pass_form", methods={"GET"}, options={"expose" = true})
     * @IsGranted("IS_AUTHENTICATED_FULLY")
     */
    public function passform(): Response
    {
        try {
            return $this->render('view/user/passform.html.twig');
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * change user password
     * @Route("/profile/pass", name="user_profile_pass_change", methods={"PUT"}, options={"expose" = true})
     * @IsGranted("IS_AUTHENTICATED_FULLY")
     */
    public function passchange(Request $request): Response
    {
        try {
            $content = json_decode($request->getContent());
            if (!$this->passwordEncoder->isPasswordValid($this->actualUser, $content->old)) {
                throw new Exception("La contraseña actual es incorrecta");
            }
            if ($content->new != $content->conf) {
                throw new Exception("Las contraseñas no coinciden");
            }
            $this->rep->upgradePassword($this->actualUser,  $this->passwordEncoder->encodePassword(
                $this->actualUser,
                $content->new
            ));
            $this->util->info("Se ha actualizado la contraseña del usuario <b>{$this->actualUser->getId()}</b>(<em>{$this->actualUser->getUsername()}</em>)");
            return new Response("Contraseña actualizada");
        } catch (ORMException $e) {
            return $this->util->errorResponse($e);
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * show user profile
     * 
     * @Route("/profile", name="user_profile", methods={"GET"})
     * @IsGranted("IS_AUTHENTICATED_FULLY")
     */
    public function profile(): Response
    {
        try {
            return $this->render("view/user/profile.html.twig", [
                // 'user' => $user
            ]);
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * show an user
     * 
     * @Route("/{id}", name="user_show", methods={"GET"}, options={"expose" = true})
     * @IsGranted("ROLE_ADMIN")
     */
    public function edit(int $id): Response
    {
        try {
            $user = $this->rep->find($id);
            if ($user == null) {
                throw new Exception("No se ha encontrado el usuario");
            }
            return $this->render("view/user/edit.html.twig", [
                'user' => $user
            ]);
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * add user
     * 
     * @Route("/", name="user_add", methods={"POST"}, options={"expose" = true})
     * @IsGranted("ROLE_ADMIN")
     */
    public function add(Request $request): Response
    {
        $content = json_decode($request->getContent());
        try {
            $user = new User();
            $user->setUsername($content->username)
                ->setMail($content->email)
                ->setName($content->name)
                ->setPassword(
                    $this->passwordEncoder->encodePassword(
                        $user,
                        $content->password
                    )
                )
                ->setRoles($content->roles)
                ->setSuspended(false);
            $this->rep->add($user);
            $this->util->info("Se ha agregado al usuario <b>{$user->getId()}</b>(<em>{$user->getUsername()}</em>)");
            return new Response("Usuario agregado");
        } catch (UniqueConstraintViolationException $e) {

            if ($this->util->containsString($e->getMessage(), User::FK_USERNAME)) {
                $message = "El usuario <b>{$content->username}</b> ya existe.";
            } elseif ($this->util->containsString($e->getMessage(), User::FK_MAIL)) {
                $message = "El correo <b>{$content->email}</b> ya está en uso.";
            } else {
                $message = $e->getMessage();
            }
            //$this->util->errorException($e);
            //unknown error, user not recognized to generate error log
            return new Response($message, Response::HTTP_INTERNAL_SERVER_ERROR);
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * update user with x-editable
     * 
     * @Route("/{id}", name="user_update", methods={"PUT", "PATCH"})
     * @IsGranted("IS_AUTHENTICATED_FULLY")
     */
    public function update(Request $request, int $id = 0): Response
    {
        parse_str($request->getContent(), $content);
        $content = new Editable($content);
        try {
            $user = $this->actualUser;
            if ($id > 0) {
                if ($this->actualUser->hasRole("ROLE_ADMIN")) {
                    $user = $this->rep->find($id);
                } else {
                    throw new Exception("Permiso denegado");
                }
            }
            $message = "Se ha actualizado";
            if ($content->name == "username") {
                $user->setUsername($content->value);
                $message .= " el nombre de usuario";
            }
            if ($content->name == "email") {
                $user->setMail($content->value);
                $message .= " el correo";
            }
            if ($content->name == "name") {
                $user->setName($content->value);
                $message .= " el nombre";
            }
            if ($content->name == "roles") {
                if (!$this->actualUser->hasRole("ROLE_ADMIN")) {
                    throw new Exception("Permiso denegado");
                }
                $user->setRoles($content->value);
                $message .= " el rol";
            }
            $this->rep->update();
            $this->util->info($message . " del usuario <b>{$user->getId()}</b>(<em>{$user->getUsername()}</em>)");
            return new response($message);
        } catch (UniqueConstraintViolationException $e) {
            if ($this->util->containsString($e->getMessage(), User::FK_USERNAME)) {
                $message = "El usuario <b>{$content->value}</b> ya existe.";
            } elseif ($this->util->containsString($e->getMessage(), User::FK_MAIL)) {
                $message = "El correo <b>{$content->value}</b> ya está en uso.";
            } else {
                $message = $e->getMessage();
            }
            //$this->util->errorException($e);
            //unknown error, user not recognized to generate error log
            return new Response($message, Response::HTTP_INTERNAL_SERVER_ERROR);
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * suspend user
     * 
     * @Route("/{id}", name="user_delete", methods={"DELETE"}, options={"expose" = true})
     * @IsGranted("ROLE_ADMIN")
     */
    public function delete(int $id): Response
    {
        try {
            $user = $this->rep->find($id);
            if ($user->hasRole("ROLE_GOD")) {
                throw new Exception("No se puede eliminar a Dios");
            } else {
                $user->setSuspended(true)
                    ->setPassword(
                        $this->passwordEncoder->encodePassword(
                            $user,
                            $this->util->generateRandomString(10)
                        )
                    );
            }
            $this->rep->update();
            $this->util->info("Se ha suspendido al usuario <b>{$id}</b>(<em>{$user->getUsername()}</em>)");
            return new Response("Usuario suspendido");
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * Change suspended user password
     * 
     * @Route("/reSuspend/{id}", name="user_resuspend", methods={"POST"})
     */
    public function changeSuspendedPassword(int $id)
    {
        try {
            $user = $this->rep->find($id);
            if (!$user->getSuspended()) {
                throw new Exception("Este usuario no ha sido suspendido.");
            }
            $user->setPassword(
                $this->passwordEncoder->encodePassword(
                    $user,
                    $this->util->generateRandomString(10)
                )
            );
            $this->rep->update();
            $this->util->info("Se ha <b>re</b>-suspendido al usuario <b>{$id}</b>(<em>{$user->getUsername()}</em>)");
            return new Response("ok");
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }
}
